let request = require('request')

let num = 0

const query = () => {
  setTimeout(() => {
    request('http://www.adidas.com/us/harden-vol.-1-shoes/CG4940.html', (err, res, body) => {
      if(err){
        console.log(err, '########## errror!!!!')
      }
      let response = body.match(/data-sitekey="(.*?)"><\/div>/)[1]
      num++
      console.log(num, response)
      query()
    })
  }, 1000)
}

query()