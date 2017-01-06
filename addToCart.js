$('body').html('<html><div class="transformer"></div></html>')

const link = window.location.search
const sku = link.match(/style=\w+/g)[0].split('=')[1].toUpperCase()
const size = link.match(/size=\w+/g)[0].split('=')[1]
const qty = link.match(/quantity=\w+/g)[0].split('=')[1]
// const capDupFieldName = link.match(/capdupfieldname=\w+/g)[0].split('=')[1]
const captcha = link.match(/response=(.*)/)[0].split('=')[1]
const pid = sku.toUpperCase() + size
const data = {
  masterPid: sku,
  pid: pid,
  'g-recaptcha-response': captcha,
  quantity: qty,
  ajax: true,
  // [capDupFieldName]: captcha
}

$.ajax({
  url: "http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-MiniAddProduct?clientId=0",
  type: 'POST',
  data,
  success: function(response) {
    const div = document.querySelector('.transformer')

    // if(response.indexOf('minicartcontent') > 0) {
      //if carting is successful
      // div.innerHTML = '<div><h3><a href="https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show">Carted</a><h3></div>'
    // } else {
    //   //carting was not successful
    //   div.innerHTML = '<div><h3><a href="https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-Show">Could Not Cart</a><h3></div>'
    // }
    div.innerHTML = JSON.stringify(response)
  }
})