const request = require("request")
const pid = process.argv[2].toUpperCase()
const secret = require('./keys.js')
let timesRun = 0

if(!pid){
  console.log('Please input product ID')
}

const foundSize = (notificationLink, size) => {
  request(notificationLink, (error, response, body) => {
    if(error){
      throw error
    }
    console.log('Found stock in size: ' + size + ' & sent IFTTT notification to phone!')
  })
}

let sizeOptions = { method: 'GET',
  url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Product-GetVariants',
  qs: { pid: pid },
  headers: { 'cache-control': 'no-cache' }
}

const sizeChecker = (timesChecked) => {

  const checkAgain = (timesChecked) => {
    timesChecked++
    console.log('Checking again in a 10 mins: ' + timesChecked + ' attempt')
    setTimeout(() => {sizeChecker(timesChecked)}, 600000)
  }

  request(sizeOptions, function (error, response, body) {
    if (error) throw error
    if(response.body.indexOf('variations') === -1){
      console.log('No sizes available at all, checking again.')
      checkAgain(timesChecked)
    } else {
      let sizes = JSON.parse(response.body).variations.variants
      for(var i = 0; i < sizes.length; i++){
        let shoe = sizes[i]
        let size = shoe.attributes.size
        let quantity = shoe.ATS
        if((size === '6' || size === '8' || size === '9' || size === '10') && quantity > 0) {
          console.log(size, " ", quantity)
          let sizeTrigger = { method: 'POST',
            url: 'https://maker.ifttt.com/trigger/Found_size/with/key/' + secret.ifttt.key,
            qs: { value1: size, value2: quantity, value3: pid},
          }
        foundSize(sizeTrigger, size)
        }
      }
      checkAgain(timesChecked)
    }
  })
}

sizeChecker(timesRun)
