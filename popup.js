// var siteKey = ''

function redirect() {
 chrome.tabs.create({url: 'http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Page-HeaderInfo'});
}

$(document).ready(function() {
  $("#atc").click(function() {
    redirect()
  });
});
