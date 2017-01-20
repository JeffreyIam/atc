let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')
let request = require('request')
let webdriver = require('selenium-webdriver')
let app = express()
let solvedCapRes = []
let port = 1337
let numOfCapRes = 0

app.use(bodyParser.json())

app.listen(port, () => {
  console.log('listening on port: ' + port)
})

app.post('/key', (req, res) => {
  sitekeySolution = req.body.key
  if(sitekeySolution.length > 0) {
    solvedCapRes.push(sitekeySolution)
    solvedCapRes.push({key: sitekeySolution, time: 0})
    numOfCapRes = solvedCapRes.length
    res.json(sitekeySolution)
  }
})

app.post('/id', function(req, res) {
  let productUrl = req.body.productUrl
  let pid = req.body.pid
  let qty = req.body.quantity
  let sku = req.body.masterPid
  if(productUrl.length === 0) {
    for (let i = 0; i < solvedCapRes.length; i++) {
      let captcha = solvedCapRes[i].key
      addToCart(pid, qty, sku, captcha)
    }
    solvedCapRes = []
  } else {
    checkProductLive(productUrl, pid, qty, sku)
  }
})

app.get('/key', (req, res) => {
  let response = solvedCapRes
  res.json(solvedCapRes.length)
})

setInterval(() => {
  if(solvedCapRes.length > 0) {
    for(var i = 0; i < numOfCapRes; i++){
      if(solvedCapRes[i].time < 119) {
        solvedCapRes[i].time++
      } else {
        solvedCapRes.splice(i,1)
        numOfCapRes--
        i--
      }
    }
  }
 }, 1000)

const checkProductLive = (productUrl, pid, qty, sku) => {
  console.time('check')
  let options = {
    method: 'GET',
    url: productUrl,
    headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    }
  }

  console.log('Checking if product is live... unexpired captchas left: ', numOfCapRes)

  request(options, (error, response, body) => {
    if(error) throw error
    let len = body.split('COMING SOON!').length
    if(len === 2){
      console.log('Product is live, adding to cart')
      for (let i = 0; i < solvedCapRes.length; i++) {
        let captcha = solvedCapRes[i].key
        addToCart(pid, qty, sku, captcha)
      }
    solvedCapRes = []
    } else {
      console.log('Product is not live yet, rechecking url in a second')
      setTimeout(()=> {
        checkProductLive(productUrl, pid, qty, sku)
      }, 1000)
    }
  })
}

const addToCart = (pid, qty, sku, captcha) => {
  console.log('Adding to cart!')
  let formData = {
    pid: pid,
    Quantity: qty,
    'g-recaptcha-response': captcha,
    masterPid: sku,
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
    if (error) {
      console.log(error)
    } else {
      console.log(res.statusCode)
      let allCookies = res.headers['set-cookie']
      let driver = new webdriver.Builder().forBrowser('chrome').build()
      driver.get('http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
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
      driver.get('http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
    }
  })
}
