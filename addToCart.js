// $('body').html('<html><div class="transformer"></div></html>')

// const link = window.location.search
// const sku = link.match(/style=\w+/g)[0].split('=')[1].toUpperCase()
// const size = link.match(/size=\w+/g)[0].split('=')[1]
// const qty = link.match(/quantity=\w+/g)[0].split('=')[1]
// const pid = sku.toUpperCase() + size
// const xhr = new XMLHttpRequest()
// // const request = require('request')
// // request = request.defaults({jar: true})
// // var webdriver = require('selenium-webdriver')
// // var driver = new webdriver.Builder().forBrowser('chrome').build()
// // console.log(numOfKeys)
// //
// // xhr.open("GET", "http://127.0.0.1:1337/id", false)
// // xhr.send()

// //returns number of keys available
// const grabAvailable = (url) => {
//   console.log("grabavailable")
//   xhr.open("GET", url, false)
//   xhr.send()
//   console.log(xhr.responseText)
//   return xhr.responseText
// }

// var addToCart = () => {
//   console.log("addtocart")
//   let formData =  {
//     pid: pid,
//     Quantity: qty,
//     'g-recaptcha-response': captcha,
//     masterPid: sku,
//     ajax: 'true'
//   }

//     // let recaptchaResponse = document.getElementById('g-recaptcha-response').value
//     // console.log(recaptchaResponse)
//     let params = {"pid": pid, "Quantity": qty, "masterPid": sku}
//     // var xhr = new XMLHttpRequest()
//     xhr.open("POST", "http://127.0.0.1:1337/id", true)
//     xhr.setRequestHeader("Content-type", "application/json")
//     xhr.send(JSON.stringify(params))

//   // var formData = {
//   //   'layer=Add+To+Bag+overlay&pid=' + pid + '&Quantity=' + qty + '&g-recaptcha-response=' + captcha + '&masterPid=' + sku + '&sessionSelectedStoreID=null&ajax=true'
//   // }

//  // var options = { method: 'POST',
//  //    url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-MiniAddProduct?clientId=0',
//  //    form: formData,
//  //    headers: {'content-type': 'application/x-www-form-urlencoded'}
//  //  };

//  //  request(option, (error, res, body) => {
//  //    if(error) {
//  //      console.log(error)
//  //    } else {
//  //      driver.get('https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show')
//  //    }
//  //  })
// }

// addToCart()

// // let listOfKeys = grabAvailable("http://127.0.0.1:1337/Id")
// // console.log(listOfKeys)

// // setTimeout(function() {
// //   for(var i = 0; i < listOfKeys.length; i++) {
// //     console.log(captcha)
// //     addToCart(captcha)
// //   }
// // },5000)


