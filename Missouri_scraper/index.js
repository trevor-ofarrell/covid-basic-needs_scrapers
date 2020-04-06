const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const csvjson = require('csvjson');

// A puppeteer script to scrape data on school lunches/meals available
// in the state of washington. Data is collected from:
// https://www.esd113.org/family-services-map
// Author -  Trevor O'Farrell

async function scrape() {

    try {

        const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        args: [
            '--incognito',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
        ],
        headless: false,
        });

        const page = (await browser.pages())[0];
        await page.setViewport({
            width: 800,
            height: 1800
        });


        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
        }

        await page.goto('https://mophep.maps.arcgis.com/apps/opsdashboard/index.html#/d86f6c720199430d97158de172790717')
        await page.waitForSelector('#ember53 > div.flex-fix.widget-header > div > p > span > strong > u > span')
        await delay(500)

        const site = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(1)'))
            return locations.map((a) => a.textContent);
        })

        const address = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(2)'))
            return locations.map((a) => a.textContent);
        })

        const sponsor = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(3)'))
            return locations.map((a) => a.textContent);
        })

        const phone = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(4)'))
            return locations.map((a) => a.textContent);
        })

        const email = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(5)'))
            return locations.map((a) => a.textContent);
        })

        const supper = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(6)'))
            return locations.map((a) => a.textContent);
        })

        const comments = await page.evaluate(() => {
            const locations = Array.from(document.querySelectorAll('#ember71 > div > div > p:nth-child(7)'))
            return locations.map((a) => a.textContent);
        })

        let item = []
        const itemList = []
        for (let i = 0; i < site.length; i++) {
            
            item = [
                site[i],
                address[i],
                sponsor[i],
                phone[i],
                email[i],
                supper[i],
                comments[i]
            ]
            itemList.push(item)
        }
        console.log(('output: ', itemList))
        return(('items: ', itemList))

    } catch (e) {
        console.error(e);
    }  

}

scrape()