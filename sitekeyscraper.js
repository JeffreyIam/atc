const request = require('request')
const zlib = require('zlib')
const parseString = require('xml2js').parseString

const grabLink = (url) => {
  let options = {
    method: 'GET',
    uri: url,
    gzip: true
  }
  request(options, (err, res, body) => {
    parseString(body, (err, result) => {
      if (err) {
        console.log(err)
        console.log('Link Error - Please check your url: ' + url + ' / or you got IP banned')
        return
      }
      let items = result.urlset['url']
      items.forEach((value) => {
        let pageUrl = value.loc[0]
        if(pageUrl.indexOf('shoes') > -1) {
          request(pageUrl, (error, res, body) => {
            if(body !== undefined && body.indexOf('data-sitekey') > -1) {
              console.log('Sitekey found on: ' + pageUrl)
              let sitekey = body.split('data-sitekey="')[1].split('"><')[0]
              console.log('--------------' + sitekey + '--------------')
            } else if(body === undefined){
              console.log(pageUrl + ' is oos')
            }
          })
        }
      })
    })
  })
}

const sitemapList = ['http://www.adidas.com/on/demandware.static/-/Sites-adidas-US-Library/en_US/v/sitemap/product/adidas-US-en-us-product.xml']

sitemapList.forEach((url) => {
  grabLink(url)
})
