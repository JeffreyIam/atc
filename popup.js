function redirect(key) {
 chrome.tabs.create(
  {url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Page-HeaderInfo/' + key}
  )
}

addEventListener('DOMContentLoaded', () => {
  const siteKeyInput = document.querySelector('#siteKey')
  const siteKeyButton = document.querySelector('#atc')

  siteKeyButton.addEventListener('click', () => {
    redirect(siteKeyInput.value)
  })
})