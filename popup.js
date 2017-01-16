function redirect(key) {
 chrome.tabs.create(
  {url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Page-HeaderInfo/' + key}
  )
}

addEventListener('DOMContentLoaded', () => {
  const siteKeyInput = document.querySelector('#siteKey')
  const siteKeyButton = document.querySelector('#atc')
  const copy = document.querySelector('#copy')
  let siteKey = ''
  $.ajax({
    url: "http://www.adidas.com/us/harden-vol.-1-shoes/CG4940.html",
    type: 'GET',
    success: function(response) {
      let dataSiteKey = response.match(/data-sitekey="(.*?)"><\/div>/)[1]
      siteKey = dataSiteKey
      document.querySelector('span').textContent = dataSiteKey
      return
    }
  })

  const copyToInput = (key) => {
    console.log(key)
    siteKeyInput.value = key
  }

  siteKeyButton.addEventListener('click', () => {
    redirect(siteKeyInput.value)
  })
  copy.addEventListener('click', () => {
    console.log(siteKey)
    copyToInput(siteKey)
  })
})