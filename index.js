const PORT = 8000
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

app.post('/historico', jsonParser, (req, res) => {
    
    const historico = 'https://br.financas.yahoo.com/quote/'+req.body.name+'.SA/history?p='+req.body.name+'.SA'

    axios(historico)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const ultimas = []
            let acao = {}

            $('.BdT', html).each(function () { //<-- cannot be a function expression
                const data = $(this).find('td:nth-child(1)').text()
                const abrir = $(this).find('td:nth-child(2)').text() 
                const alto = $(this).find('td:nth-child(3)').text() 
                const baixo = $(this).find('td:nth-child(4)').text() 
                const fechamento = $(this).find('td:nth-child(5)').text() 
                const volume = $(this).find('td:nth-child(7)').text() 
                ultimas.push({
                    data,
                    abrir,
                    alto,
                    baixo,
                    fechamento,
                    volume
                })
            })
            ultimas.length -= 2

            $('h1', html).each(function () {
                const name = $(this).text()

                acao = {
                    name,
                    ultimas
                }
            })

            res.json(acao)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))