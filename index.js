const express = require('express')
const puppeteer = require('puppeteer')
const path = require('path')
const replace = require('absolutify')
const { url } = require('inspector')
const product = require("./api/product")


const app = express()

app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})
app.get('/api/product', product)

app.get('/proxy', async(req, res) =>{
    const { url } = req.query

    if(!url){
        return res.send('NO url found')
    }else{
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()

            await page.goto(`https://${url}`)

            let document = await page.evaluate(() => document.documentElement.outerHTML)
            document = replace(document, `/proxy?url=${url.split('/') [0]}`)

            await browser.close()

            return res.send(document)
        } catch (err) {
            console.log(err);
            return res.send(err)
        }
    }
})

app.listen(3000, () => console.log(`Server runing on port 3000`))