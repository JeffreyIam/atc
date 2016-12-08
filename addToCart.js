$('body').html('<html><div class="transformer"></div></html>')

var link = window.location.search
var sku = link.match(/style=\w+/g)[0].split('=')[1].toUpperCase()
var size = link.match(/size=\w+/g)[0].split('=')[1]
var qty = link.match(/quantity=\w+/g)[0].split('=')[1]
var capDupFieldName = link.match(/capdupfieldname=\w+/g)[0].split('=')[1]
var captcha = link.match(/response=(.*)/)[0].split('=')[1]
var pid = sku.toUpperCase() + size

var data = {
  masterPid: sku,
  pid: pid,
  'g-recaptcha-response': captcha,
  quantity: qty,
  ajax: true,
  [capDupFieldName]: captcha
}

$.ajax({
  url: "http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Cart-MiniAddProduct?clientId=0",
  type: 'POST',
  data,
  success: function(response) {
    document.getElementsByClassName("transformer")[0].innerHTML = JSON.stringify(response)
  },
  error: function(response) {
    document.getElementsByClassName("transformer")[0].innerHTML = JSON.stringify(response)
  }
})