const express = require('express');
const app = express();
const cors = require('cors')
const puppeteer = require('puppeteer');
const url = require("url");


app.use(cors());

// app.get('/api-req', function (req, res) {
//     const results = []; // collects all results
//     let url = req.query.url;
//     let limit = req.query.limit;
//     let deep = req.query.deep;
//
//     puppeteer.launch().then(async function (browser) {
//         const page = await browser.newPage();
//         let paused = false;
//         let pausedRequests = [];
//
//         const nextRequest = () => { // continue the next request or "unpause"
//             if (pausedRequests.length === 0) {
//                 paused = false;
//             } else {
//                 // continue first request in "queue"
//                 (pausedRequests.shift())(); // calls the request.continue function
//             }
//         };
//
//         await page.setRequestInterception(true);
//         page.on('request', request => {
//             if (paused) {
//                 pausedRequests.push(() => request.continue());
//             } else {
//                 paused = true; // pause, as we are processing a request now
//                 request.continue();
//             }
//         });
//
//         page.on('requestfinished', async (request) => {
//             const response = await request.response();
//             const url = request.url();
//             if (url.startsWith('http') && url.split('/').length - 3 == deep) {
//                 results.push(request.url());
//             }
//             nextRequest(); // continue with next request
//         });
//         page.on('requestfailed', (request) => {
//             // handle failed request
//             nextRequest();
//         });
//         await page.setDefaultNavigationTimeout(0);
//
//         await page.goto(url, {waitUntil: 'domcontentloaded'});
//
//         await browser.close();
//
//         // console.log(results);
//         res.send({'urls': results.slice(0, limit), length: results.length});
//     });
// });

app.get('/check', function (req, res) {
    let url = req.query.url;
    let limit = req.query.limit;
    let deep = req.query.deep;

    puppeteer.launch().then(async function (browser) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, {waitUntil: 'networkidle0'});

        let hrefs = await page.$$eval('a', as => as.map(a => a.href));
        hrefs = hrefs.filter(a => a.split('/').length - 3 == deep).slice(0, limit);

        await browser.close();
        res.send({length: hrefs.length, urls: hrefs, url: page.url()});
    });
});

app.get('/api', function (req, res) {
    let url = req.query.url;
    let limit = req.query.limit;
    let deep = req.query.deep;
    const results = [];

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await crawlInternal(page, url, 0);

        await browser.close();
        await res.send({length: results.length, urls: results, sourceUrl: url});

    })().catch(error => {
        console.error("Something bad happend...", error);
    });

    async function crawlInternal(page, url, dpath) {
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url, {waitUntil: 'domcontentloaded'});

        let urlItems = await page.$$eval('a', as => as.map(a => a.href));
        if (urlItems) {
            for (let item of urlItems) {
                if (results.length < limit && dpath < deep) {
                    results.push(item);
                    console.log(`Capturing ${item}`);
                    await crawlInternal(page, item, dpath + 1)
                } else {
                    return;
                }
            }
        }
    }
});

// Making Express listen on port 7000
app.listen(7000, function () {
    console.log('Running on port 7000.');
});