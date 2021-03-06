const link = window.location.pathname.split("/")
const sitekey = link[link.length-1]

function changeView(sitekey, fun) {

  $('body').html('<head><script src="https://www.google.com/recaptcha/api.js"></script></head><div class="jumbotron vertical-center" style="min-height: 100%; min-height: 100vh; display: flex; align-items: center"><div class="container" style="text-align: center; border: 2px solid black; width: 500px"><h2>Num of keys available: <span></span><h2><h3>Add Item To Cart:</h3><form action="http://example.net" method="get"><input id="productUrl" type="text" name="style" class="form-control" style="width: 100px; border-radius:75px; text-align: center; margin: auto; margin-bottom: 5px" placeholder="productUrl"><input id="sku" type="text" name="style" class="form-control" style="width: 100px; border-radius:75px; text-align: center; margin: auto; margin-bottom: 5px" placeholder="SKU"><input placeholder="Quantity" id="qty" class="form-control" style="width: 100px; margin: auto; border-radius:75px; margin-bottom: 5px; text-align: center" name="quantity"/><select class="form-control" id="sizeCode" style="width:100px; border-radius:75px; margin: auto; margin-bottom: 5px" name="size"><option value="">Select Size</option><option value="_240">5k</option><option value="_260">6k</option><option value="_310">8k</option><option value="_330">9k</option><option value="_350">10k</option><option value="_530">4</option> <option value="_540">4.5</option> <option value="_550">5</option> <option value="_560">5.5</option> <option value="_570">6</option> <option value="_580">6.5</option> <option value="_590">7</option> <option value="_600">7.5</option> <option value="_610">8</option> <option value="_620">8.5</option> <option value="_630">9</option> <option value="_640">9.5</option> <option value="_650">10</option> <option value="_660">10.5</option> <option value="_670">11</option> <option value="_680">11.5</option> <option value="_690">12</option> <option value="_700">12.5</option> <option value="_710">13</option> <option value="_720">13.5</option> <option value="_730">14</option> <option value="_750">15</option></select><br><div class="g-recaptcha" style="margin: auto; display: inline-block; margin-bottom: 5px" async data-sitekey="'+ sitekey +'"></div></form></div><div class="container" style="text-align: center; border: 2px solid black; width: 500px"><h3>Check Stock Inventory:</h3><button id="ajaxReq" class="btn btn-success">Harvest Captcha</button><button id="sendParams" class="btn btn-primary">Add to Cart</button><button id="createTable" class="btn btn-primary">Check Inv</button><div class="container" style="width: 350px; height: 600px; overflow: auto"><table id="inventory" class="table table-striped table-bordered table-condensed table-hover" style="align: center"></table/></div></div></div>')

  document.querySelector('span').textContent = 0

  setInterval(() => {
    let url = document.getElementById('productUrl').value
    if(document.getElementById('sku').value === '' && url.length > 0){
      let productId = url.match(/([A-Z])\w+/g)[0].toUpperCase()
      document.getElementById('sku').value = productId
    }
    $.ajax({
      url: "http://127.0.0.1:1337/key",
      type: 'GET',
      success: function(response) {
        let capCount = response
        document.querySelector('span').textContent = response
      }
    })
  }, 2000)

  document.querySelector('#ajaxReq').addEventListener('click', () => {
    let recaptchaResponse = document.getElementById('g-recaptcha-response').value
    let params = {"key": recaptchaResponse}
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:1337/key", true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.send(JSON.stringify(params))
  })

  document.querySelector('#sendParams').addEventListener('click', () => {
    let xhr = new XMLHttpRequest()
    let productUrl = document.getElementById('productUrl').value
    let sku = document.getElementById('sku').value
    let qty = document.getElementById('qty').value
    let size = document.getElementById('sizeCode').value
    let pid = sku.toUpperCase() + size
    let params = {"pid": pid, "quantity": qty, "masterPid": sku, "productUrl": productUrl}

    xhr.open("POST", "http://127.0.0.1:1337/id", true)
    xhr.setRequestHeader("Content-type", "application/json")
    console.log('sent ' + params)
    xhr.send(JSON.stringify(params))
  })

  document.querySelector('#createTable').addEventListener('click', () => {
    const sku = document.querySelector('#sku').value.toUpperCase()
    const sizeAndStock = document.querySelector('#inventory')

    $.ajax({
      url: "http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Product-GetVariants?pid=" + sku,
      type: 'GET',
      success: function(response) {
        const productDetails = response.variants !== null ? response.variations.variants : []
        console.log(productDetails)
        const rowsAndCols = productDetails.length > 0 ? productDetails.reduce(function(total, current) {
          const stockQty = current.ATS
          const size = current.attributes.size
          total += '<tr><td>'+ size + '</td>' + '<td>'+ stockQty + '</td></tr>'
          return total
        },'') : (function() {alert('SKU incorrect/Product cannot be found at the moment')})()
        sizeAndStock.innerHTML = '<tbody align="center"><tr><th style="text-align:center">Size(US)</th><th style="text-align:center">Stock</th></tr>' + rowsAndCols + '</tbody>'
      }
    })
  })
}

changeView(sitekey)

//We need to get the captcha value from the input element within an iframe, but we can't just grab the captcha value from the element because we'll get a cross origin error since it's in an iframe. Instead, we can get access to it by making a page submit, then we can collect it from the URI
