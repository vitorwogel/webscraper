const PORT = 777
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

app.use(cors())

app.get('/', function (req, res) {
    res.json('This is my webscraper')
})

app.get('/ge', jsonParser, (req, res) => {
    
    const ge = 'https://ge.globo.com/'

    axios(ge)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const query = []

            $('.feed-post-body', html).each(function () { //<-- cannot be a function expression
                const header = $(this).find('.feed-post-header').text()
                const title = $(this).find('.feed-post-body-title').text()
                const resumo = $(this).find('.feed-post-body-resumo').text()

                query.push({
                    header,
                    title,
                    resumo  
                })
            })
            
            res.json(query)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))