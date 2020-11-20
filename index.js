'use strict'
const puppeteer = require('puppeteer');
const fs = require('fs');
const options = {
  headless: true,
  defaultViewport: null,
  args: [
    '--no-sandbox',
    '--window-size=400,500'
  ]
};
(async () => {
  const data = JSON.parse(fs.readFileSync('./login.json', 'utf8'))
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage()
  await page.goto('https://vrchat.com/home/locations', { waitUntil: 'networkidle0' })
  await page.type("#username_email", data.Username)
  await page.type("#password", data.Password)
  await page.click("#login-form-submit")
  //await page.waitForSelector("#app > div > main > div > div.container-fluid > div > div.d-none.d-lg-block.fixed-top.bg-gradient-secondary.rightbar.col-3.offset-9 > div > div > button")
  await page.waitFor(3000)
  //await page.waitForSelector('.center-block.text-center', {timeout: 0});  
  await page.evaluate(() => {
    elementDelete = document.querySelector('.d-none.d-lg-block.fixed-top.bg-gradient-secondary.rightbar.col-3.offset-9')
    elementDelete.parentNode.removeChild(elementDelete)
  });
  const items = await page.$$('.user-info')
  for (let i = 0; i < items.length; i++) {
    await console.log((await (await items[i].getProperty('textContent')).jsonValue()).replace(/In-World(.*)/gi, ''))
  }
  await browser.close()
})();