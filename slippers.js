let request = require("request");
let sizesEightNineTen = [{sizeId: 620, num: 8}, {sizeId: 640, num: 9}, {sizeId: 660, num: 10}]
let times = 0
let size
const phoneNumberArg = process.argv[2]

if (!phoneNumberArg || /[^\d\-\(\)\. ]/.test(phoneNumberArg)) {
  console.log('Enter your phone number as an argument so you can get notified when there is a change in the website.')
  return
}

const phoneNumber = phoneNumberArg.replace(/[^\d]/g, '')
if (phoneNumber.length < 10) {
  console.log('Make sure your phone number is at least 10 characters long (include your area code).')
  return
}

const getSlippers = () => {
  times++

  if(times % 3 === 0){
    size = sizesEightNineTen[0]
  } else if(times % 5 === 0){
    size = sizesEightNineTen[1]
  } else{
    size = sizesEightNineTen[2]
  }

  var options = { method: 'POST',
  url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-MiniAddProduct',
  qs: { clientId: '0' },
  headers:
   { 'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded' },
  form: { masterpid: 'S79352', pid: 'S79352_' + size.sizeId, quantity: '1' } }

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if(body.indexOf('blocked') > -1){
      console.log('Blocked!!!!')
    }
    if(body.indexOf('<strong>1</strong>') > -1){
      let webdriver = require('selenium-webdriver')
      let driver = new webdriver.Builder().forBrowser('chrome').build()
      let allCookies = response.headers['set-cookie']
        driver.get('https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
          driver.manage().deleteAllCookies()
          for (let i = 0; i < allCookies.length; i++) {
            let name = allCookies[i].split(';')[0].split('=')[0]
            if(name !== 'dwsid'){
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
        driver.get('https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')

        const dataString = encodeURI(`number=${phoneNumber}&message=Added to cart.`)
        const options = {
          url: 'http://textbelt.com/text',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: dataString
        }

        request(options, (err, res, body) => {
          if (err) {
            console.log(err)
            console.log(`Error sending text message to ${phoneNumber}.`)
          } else {
            console.log(res)
            console.log(`Sent text message to ${phoneNumber}.`)
          }
        })

    } else {
      console.log('Waiting 5 seconds..on ' + times + ' attempt' + ' tried to add ' +  size.num)
      setTimeout(()=>{getSlippers()}, 5000)
    }

  });
}

getSlippers()


