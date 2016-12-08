chrome.runtime.onInstalled.addListener(function(detail) {
  if(detail.reason === 'install' || detail.reason === 'update') {
      window.open("http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Page-HeaderInfo");
  }
})
