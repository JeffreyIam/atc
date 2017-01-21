const request = require('request')
const cheerio = require('cheerio');
const secret = require('./keys.js')
// let website = 'http://www.adidas.com/us/harden-vol.-1-shoes/CG4940.html'
// let website = 'http://www.adidas.com/us/pp-ace-tango-17-plus-purecontrol-turf-shoes/BY9164.html'
// let website = 'http://www.adidas.com/us/ultraboost-shoes/S80682.html'
let website = 'http://www.adidas.com/us/ultra-boost-uncaged-shoes/BA9797.html'
let masterPid = process.argv[2]
const size = process.argv[3]
const gender = process.argv[4]
let isChecking = false
let webdriver = require('selenium-webdriver')
let By = webdriver.By
let sitekey = ''

if(!masterPid || !masterPid.match(/[A-Z]/g)) {
  console.log('Please enter Product ID i.e. S79168 in caps..')
  return
}

if(!size || !size.match(/[0-9]/g)) {
  console.log('Please enter a size')
  return
}

if(!gender || !gender.match(/[a-z]+/)) {
  console.log('Please enter gender: male/female..')
  return
}
const menSizeTable = {
  4:'_530', 4.5: '_540', 5:'_550', 5.5: '_560', 6: '_570', 6.5: '_580', 7: '_590', 7.5: '_600', 8: '_610', 8.5: '_620', 9: '_630', 9.5: '_640', 10: '_650', 10.5: '_660', 11: '_670', 11.5: '_680', 12: '_690', 12.5: '_700', 13: '_710', 13.5: '_720', 14: '_730', 14.5: '_740', 15: '_750', 15.5: '_760', 16: '_770'
}

const womenSizeTable = {
  5: '_530', 5.5: '_540', 6: '_550', 6.5: '_560', 7: '_570', 7.5: '_580', 8: '_590', 8.5: '_600', 9: '_610', 9.5: '_620', 10: '_630', 10.5: '_640', 11: '_650', 11.5: '_660', 12: '_670'
}

const carted = (notificationLink) => {
  request(notificationLink, (error, response, body) => {
    if(error){
      throw error
    }
    console.log('Sent IFTTT notification to phone!')
  })
}

const addToCart = (pid, masterPid, captcha) => {
  console.time('cart')
  let formData = {
    pid: pid,
    Quantity: 1,
    'g-recaptcha-response': captcha,
    masterPid: masterPid,
    ajax: 'true'
  }
  let option = {
    method: 'POST',
    url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/default/Cart-MiniAddProduct?clientId=0',
    form: formData,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    }
  }

  request(option, (error, res, body) => {
    console.timeEnd('ATC')
    if (error) {
      console.log(error)
    } else {
      if(body.indexOf('<strong>0</strong>') > -1) {
        console.log('Could not cart.')
        console.timeEnd('cart')
        let sizeTrigger = { method: 'POST',
          url: 'https://maker.ifttt.com/trigger/Found_size/with/key/' + secret.ifttt.key,
          qs: { value1: 'Couldnt cart', value2: ':(', value3: ':\'('},
        }
        carted(sizeTrigger)
        return
      }
      if(body.indexOf('<strong>1</strong>') > -1) {
        console.log('Carted & Running it back!')
        // grabLink(website)
        let sizeTrigger = { method: 'POST',
          url: 'https://maker.ifttt.com/trigger/Found_size/with/key/' + secret.ifttt.key,
          qs: { value1: size, value2: 1, value3: masterPid},
        }
        carted(sizeTrigger)
      }
      let allCookies = res.headers['set-cookie']
      let driver = new webdriver.Builder().forBrowser('chrome').build()
      driver.get('http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
      setTimeout(() => {
        driver.manage().deleteAllCookies()
        for (let i = 0; i < allCookies.length; i++) {
          let name = allCookies[i].split(';')[0].split('=')[0]
          if(name !== 'sid' && name !== 'dwsid' &&  name !== 'dwsecuretoken_e23325cdedf446c9a41915343e601cde') {
            let value = allCookies[i].split(';')[0].split('=')[1]
            let domain = allCookies[i].indexOf('Domain') > -1 ? '.adidas.com' : 'www.adidas.com'
            let path = '/'
            driver.manage().addCookie({
              name: name,
              value: value,
              domain: domain,
              path: path
            })
          }
        }
        console.timeEnd('cart')
        driver.get('http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
        driver.get('https://www.adidas.com/us/delivery-start')
        driver.findElement(By.className('checkout-radio ch-login')).click()
        driver.switchTo().frame('loginaccountframe')
        driver.findElement({name: 'username'}).sendKeys('testone@gmail.com')
        driver.findElement({name: 'password'}).sendKeys('qwerty123')
        driver.findElement({name: 'signinSubmit'}).click()
      }, 5000)

    }
  })
}
// let pid = masterPid + menSizeTable[size]
// addToCart(pid, masterPid,'03AHJ_Vuu2JiP6aAPEss1e6vaAJjgyQkQZ-zkRetMr115qQ_3_sXzHZLqxqMiPP1uTob5LUA-fyqutastWpFoGpgrLuEb-l8Ir-SuHn5PJFyc2Ra_w66s6DZqvIzPKpc_0A977N6AV7jIht9CEyGf8bY_F-mVWSaHP5EaOk03OVoUBeV1kMCEDf8yZC3Qth_thnlUa5a9PfiDvewRTpSX_7159GyexSzPLd4ajyZj5NDi0YGgxH7Xjy2tSaxSKjHX3cTMPq5xyi_YV3BWDBpV2bEGyNUdvLdy79sHQjuVlg6TD87X2iVr_7ecogauRXcHeBUZUansAK3lsAwVl4bDuKlZ4fKBgQAVX6fo9m349gQD4kU9J958CS24ZxBPqmxPP7CB7RVgkTVRCBQuVqg7JQ99uNBjnXUyOCkFItBelJ1pMRZxW2zaoikgWwdgBjr-o5LX2a0FdVouPAlOvwsv8lgwOiBtAgjh2NfezCdoQtvjsIgM6D4mDmu-2HsytU9Ot6RAZQ7YBt-mlyWVe2mK7YWPYZJVgAgXCbLIsWlPCT4tjQHMM0qbBQBlrqaAMSPztgxddxYoxanCA8yMMbqGPIxw2PRLsrFRSX8k_jeceL2AT5X7i43CAH9az2ppYcoAZ-MxVxaBa5Qc9QKyeka_vXz5BGMqu-IneGAR3OsCwlZSMFDXnZUXzEnDBY8k01aAY8Wiuky9klOJNazaqO2PtkR77NxB4q2LqqcsGAfYlhM1oIPWseGfIVLk_rkc_7Au0qer-wndGgkpfLZFvfWKMwITT7Z6lY1CHeCbFtqvm1VOtXThCh74-LQdM8KVDSWtdmocx394IwRs4GvGVhTFfsCjmsSqylEJJ_6A0EOdY-D1eenoShmj5DIt3DxJLVjymjofIMyQAWQIY2hjqhDDIMRHAqgSbE80hs95EBSOBqDHC0ILas5CIyzCTP8kpovO1DQsWjqcSSSEzouUW8cuLnSMaFSy6itZ2GwxQ5E7MxTA71F7bi7Cc91_efrD7fKARRVrF5eXL5WY-FFkSna8tIGPXHfAvOdtenWVs7pW5Lm_dMSOeuGBEcuP862G9F2wnsiRQQxEhuC89eN-6JtDqz6M-SE3aLMZQb5OamMbn6IM72xRSM2l7Ovi39NPaDL0dhzgSu5kcJ6nLGptMdLvPJr16ibP3XeFmHg')

const grabSolution = (capId) => {
  console.time('grabSolution')
  console.time('timeout')
  let url = 'http://2captcha.com/res.php?key='+ secret.twoCaptcha.key + '&action=get&id=' + capId
  request(url, (err, res, body) => {
    console.log(body)
    if(body[2] !== '|') {
      setTimeout(() => {
        grabSolution(capId)
        console.timeEnd('timeout')
      }, 1000)
    } else {
      let capRes = body.match(/OK\|(.*)/)[1]
      let table = gender === 'male' ? menSizeTable : womenSizeTable
      let pid = masterPid + table[size]
      addToCart(pid, masterPid, capRes)
      console.timeEnd('grabSolution')
      console.log('Carting..')
    }
  })
}

const sendSiteKey = (googlekey) => {
  console.log('Solving recaptcha..')
  let formData = {
    key: secret.twoCaptcha.key,
    method: 'userrecaptcha',
    googlekey: googlekey,
    pageurl: 'http://www.adidas.com/us/'
  }
  let options = {
    method: 'POST',
    url: 'http://2captcha.com/in.php',
    form: formData
  }
  request(options, (err, res, body) => {
    if(err) console.log(err)
    let capId = body.match(/[0-9]+/)[0]
    console.log(capId)
    grabSolution(capId)
  })
}

const grabLink = (url) => {
  console.time('ATC')
  console.time('grabSitekey')
  console.log('Checking for sitekey..')
  if(sitekey.length === 0) {
    let options = {
      method: 'GET',
      uri: url,
    }
    request(options, (err, res, body) => {
      var $ = cheerio.load(body)
      if (err) {
        console.log(err)
        console.log('Link Error - Please check your url: ' + url + ' / or you got IP banned')
        return
      }
      if($('.g-recaptcha')['0'] === undefined) {
        console.log('No sitekey, checking again in 1 second.')
        console.timeEnd('grabSitekey')
        grabLink(url)
      } else {
        sitekey = $('.g-recaptcha')['0']['attribs']['data-sitekey']
        console.log(sitekey)
        sendSiteKey(sitekey)
        console.timeEnd('grabSitekey')
      }
    })
  } else {
    sendSiteKey(sitekey)
  }
}

grabLink(website)
