const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pptr.dev/');

    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('.DocSearch-Button');
    await page.click('.DocSearch-Button');

    await page.waitForSelector('#docsearch-input');
    await page.type('#docsearch-input',"chipi chipi chapa chapa")

    await new Promise((resolve)=>{
        setTimeout((resolve),3000)
    })

    await page.waitForSelector('#docsearch-item-5 a');
    await page.click('#docsearch-item-5 a');


    await new Promise((resolve)=>{
        setTimeout((resolve),3000)
    })

    const element =  await page.waitForSelector('h1');
    const title = await element.evaluate((ele)=>{
        return ele.textContent
    })
    console.log(title);
    await browser.close();
})();
