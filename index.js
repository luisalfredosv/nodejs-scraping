const express = require('express')
const request = require('request');
const cheerio = require('cheerio');

const app = express()

var hbs = require('hbs');
const async = require('hbs/lib/async');
const { find } = require('domutils');

hbs.registerPartials(__dirname + '/views/', function(err) {});
app.set('view engine', 'hbs');

app.use(express.static('public'));

const port = 3000;

app.get('/', async(req, res) => {

    const { msg, type, amount } = await getResponsePage();
    res.render('Home', {
        msg,
        type,
        amount
    })

})

app.get('/api', async(req, res) => {

    const { msg, type, amount } = await getResponsePage()
    res.json({
        msg,
        type,
        amount
    })

})

const getResponsePage = async() => {

    const url = "http://bcv.org.ve/";

    const data = await new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (!error) {
                $ = cheerio.load(html);
                const amount = $("div#dolar").find("strong").text().trim().replace(/\̣./g, "").replace(/\̣,/g, ".");

                resolve({
                    msg: "OK",
                    type: "USD",
                    amount

                });
            } else {
                reject(undefined);
            }
        });
    });

    return data
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})