const request = require('request')
const zlib = require('zlib')
const parseString = require('xml2js').parseString
const chalk = require('chalk')

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
      let currentIteration = 0
      let checkForHMAC = setInterval(() => {
        let link = items[currentIteration].loc[0]
        request(link, (err, res, body) => {
          console.log(link, currentIteration)
          let allCookies = JSON.stringify(res.headers['set-cookie'])
          if(allCookies.indexOf('gceeqs') > -1) {
            console.log(chalk.red('******************* found HMAC cookie @ ' +  link + '*******************'))
          }
          if(currentIteration === items.length) {
            clearIterval(checkForHMAC)
          }
          if(body.indexOf('blocked') > -1) {
            throw 'blocked!!  @  ' + link
          }
        })
        currentIteration += 1
      }, 2500)
    })
  })
}

const sitemapList = ['http://www.adidas.com/on/demandware.static/-/Sites-adidas-US-Library/en_US/v/sitemap/product/adidas-US-en-us-product.xml']

sitemapList.forEach((url) => {
  grabLink(url)
})
