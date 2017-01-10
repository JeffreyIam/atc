let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')
let request = require('request')
let webdriver = require('selenium-webdriver')
let app = express()
let solvedCapRes = []
let port = 1337

app.use(bodyParser.json())

app.listen(port, () => {
  console.log('listening on port: ' + port)
})

app.post('/key', (req, res) => {
  sitekeySolution = req.body.key
  if(sitekeySolution.length > 0) {
    solvedCapRes.push(sitekeySolution)
    solvedCapRes.push({key: sitekeySolution, time: 0})
    res.json(sitekeySolution)
  }
})

app.post('/id', function(req, res) {
  let pid = req.body.pid
  let qty = req.body.qty
  let sku = req.body.sku
  console.log(solvedCapRes.length)
  for (let i = 0; i < solvedCapRes.length; i++) {
    let captcha = solvedCapRes[i].key
    let driver = new webdriver.Builder().forBrowser('chrome').build()
    addToCart(pid, qty, sku, captcha, driver)
  }
  solvedCapRes = []
})

app.get('/key', (req, res) => {
  let response = solvedCapRes
  res.json(solvedCapRes.length)
})

setInterval(() => {
  if(solvedCapRes.length > 0) {
    for(var i = 0; i < solvedCapRes.length; i++){
      if(solvedCapRes[i].time < 119) {
        solvedCapRes[i].time ++
      } else {
        solvedCapRes.splice(i,1)
        i--
      }
    }
  }
 },1000)

const addToCart = (pid, qty, sku, captcha, driver) => {

  let formData = {
    pid: pid,
    Quantity: qty,
    'g-recaptcha-response': captcha,
    masterPid: sku,
    ajax: 'true'
  }

  let option = {
    method: 'POST',
    url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-MiniAddProduct?clientId=0',
    form: formData,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  request(option, (error, res, body) => {
    if (error) {
      console.log(error)
    } else {
      let allCookies = res.headers['set-cookie']
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
    }
  })
}
