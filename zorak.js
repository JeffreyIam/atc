const request = require('request')
const cheerio = require('cheerio');
const secret = require('./keys.js')
// let website = 'http://www.adidas.com/us/white-mountaineering-campus-80s-shoes/BA7516.html'
let website = 'http://www.adidas.com/us/pp-ace-tango-17-plus-purecontrol-turf-shoes/BY9164.html'
let masterPid = process.argv[2]
const size = process.argv[3]
const gender = process.argv[4]
let isChecking = false
let webdriver = require('selenium-webdriver')
let By = webdriver.By
let until = webdriver.until
let sitekey = ''
let cachedSitekey = '6Le4AQgUAAAAAABhHEq7RWQNJwGR_M-6Jni9tgtA'
let sitekeySolutionStorage = []
let capIdStorage = []
let gCookie = ''
// let isHmacPresent = false

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

const signInAccounts = [
  {id: 'testone@gmail.com', pw: 'qwerty123'}, {id: 'bingsun8@gmail.com', pw: 'bingdotcom8'}
]

let table = gender === 'male' ? menSizeTable : womenSizeTable
let pid = masterPid + table[size]


const carted = (notificationLink) => {
  request(notificationLink, (error, response, body) => {
    if(error){
      throw error
    }
    console.log('Sent IFTTT notification to phone!')
  })
}

//if grabHMAC takes too long to get our hmac.. we may need to make our setinterval watch for
//hmac flag before trying to cart
const grabHMAC = (url) => {
  var options = { method: 'GET',
    url: url,
    headers:
     { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    let cookies = response.headers['set-cookie']
    for(var i = 0; i < cookies.length; i++) {
      if(cookies[i].indexOf('gceeqs') > -1) {
        let hmac = cookies[i].split(';')
        hmac.splice(1,1)
        gCookie = hmac.join(';')
        // isHmacPresent = true
        console.log(gCookie)
      }
    }
  })
}

grabHMAC(website)

const addToCart = (pid, masterPid, captcha, gCookie) => {
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
    headers: {
      'Cookie': gCookie,
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    },
    form: formData
  }

  request(option, (error, res, body) => {
    console.log(res.statusCode)
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
        driver.wait(until.elementLocated(By.className('checkout-radio ch-login')), 10 * 1000).then(()=> {
          driver.findElement(By.className('checkout-radio ch-login')).click()
        })
        driver.switchTo().frame('loginaccountframe')
        driver.wait(until.elementLocated(By.name('username')), 10 * 1000).then(()=> {
          if(signInAccounts.length > 0){
            let username = signInAccounts[0]['id']
            let password = signInAccounts[0]['pw']
            signInAccounts.shift()
            driver.findElement({name: 'username'}).sendKeys(username)
            driver.findElement({name: 'password'}).sendKeys(password)
            driver.findElement({name: 'signinSubmit'}).click()
          }
        })
      }, 5000)

    }
  })
}

//check every second for a sitekey solution in our storage
setInterval(() => {
  while(sitekeySolutionStorage.length > 0) {
    //maybe and if gCookie.length > 0 ...
    let capRes = sitekeySolutionStorage[0]
    sitekeySolutionStorage.shift()
    console.log('Carting..')
    addToCart(pid, masterPid, capRes, gCookie)
  }
}, 1000)

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
      //if we get a response with our captcha solution, we will put it into our storage
      let capRes = body.match(/OK\|(.*)/)[1]
      console.log('Grabbed sitekey - added to storage')
      sitekeySolutionStorage.push(capRes)
      console.timeEnd('grabSolution')
    }
  })
}

// check for capId in storage to check for it..
setInterval(() => {
  while(capIdStorage.length > 0) {
    let capId = capIdStorage[0]
    capIdStorage.shift()
    grabSolution(capId)
  }
}, 1000)

//Ask our 2Captcha friends to solve captcha for us
const sendSiteKey = (googlekey, capIdStorage) => {
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
    capIdStorage.push(capId)
  })
}

//grab sitekey solutions from our server..requires our server to be up and running otherwise will break..
const personalSitekeySolution = (url, sitekeySolutionStorage) => {
  let options = {
    method: 'GET',
    url: url
  }
  request(options, (err, res, body) => {
    if(err) console.log(err)
    let tempStorage = JSON.parse(body)

    if(tempStorage.length > 0) {
      //when tempStorage returns 1+ captcha solutions
      for(let i = 0; i < tempStorage.length; i++) {
        sitekeySolutionStorage.push(tempStorage[i]['key'])
      }
      console.log('Grabbed sitekey solution from our server, added to storage..')
    } else if(tempStorage.length === 0 && sitekeySolutionStorage.length === 0) {
      //only request for more captchas if our server doesn't return any captchas and our
      //sitekeySolutionStorage has none left
      console.log('Out of captchas! Requesting 2 from 2Captcha now..')
      asyncDoTimes(()=> sendSiteKey(sitekey, capIdStorage), 2)
    }
  })
}

const asyncDoTimes = (f, times) => {
  let p = Promise.resolve()
  for (let i = 0; i < times; i++) {
    p = p.then(f)
  }
  return p
}

const grabLink = (url) => {
  console.time('ATC')
  console.time('grabSitekey')
  console.log('Checking for sitekey..')
  if(sitekey.length === 0) {
  //checking to see if we've grabbed sitekey already from previous loop
    let options = {
      method: 'GET',
      uri: url,
    }
    request(options, (err, res, body) => {
      var $ = cheerio.load(body)
      if(err) {
        console.log(err)
        console.log('Link Error - Please check your url: ' + url + ' / or you got IP banned')
        return
      }
      if(body.indexOf('blocked') > -1) {
        throw 'Youve been blocked'
      }
      if($('.g-recaptcha')['0'] === undefined) {
      //if page hasn't loaded sitekey yet, check again
        console.log('No sitekey, checking again in 10 seconds.')
        console.timeEnd('grabSitekey')
        setTimeout(() => {
          grabLink(url)
        }, 10000)
      } else {
        sitekey = $('.g-recaptcha')['0']['attribs']['data-sitekey']
        if(sitekey === cachedSitekey) {
          //if sitekey is the same as our cached sitekey, we will grab ready solutions from our server
          //so we don't need to wait for a 2Captcha solver to send us back a captcha solution
          console.log('Same sitekey as before..')
          personalSitekeySolution('http://127.0.0.1:1337/keyHolder', sitekeySolutionStorage)
        } else {
          //if new captcha, then we will need to have our 2Captcha friends solve captcha for us
          console.log(sitekey)
          console.timeEnd('grabSitekey')
          asyncDoTimes(()=> sendSiteKey(sitekey, capIdStorage), 2)
        }
      }
    })
  }
}

grabLink(website)
