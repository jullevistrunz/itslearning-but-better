const { contextBridge, shell } = require('electron')

const puppeteer = require('puppeteer')

contextBridge.exposeInMainWorld('preload', {
  checkLoginToItslearning: async (name, password) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://slzb.itslearning.com/')

    await page.type('#ctl00_ContentPlaceHolder1_Username_input', name)

    await page.type('#ctl00_ContentPlaceHolder1_Password_input', password)

    await page.evaluate(() => {
      document
        .querySelector('#ctl00_ContentPlaceHolder1_nativeLoginButton')
        .click()
    })

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await browser.close()

    return page.url() == 'https://slzb.itslearning.com/'
      ? 'Error: Wrong Password / Account Blocked'
      : 'Success'
  },
  getTasksFromItslearning: async (name, password) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://slzb.itslearning.com/')

    await page.type('#ctl00_ContentPlaceHolder1_Username_input', name)

    await page.type('#ctl00_ContentPlaceHolder1_Password_input', password)

    await page.evaluate(() => {
      document
        .querySelector('#ctl00_ContentPlaceHolder1_nativeLoginButton')
        .click()
    })

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await page.evaluate(() => {
      location.href =
        'https://slzb.itslearning.com/Dashboard/Dashboard.aspx?LocationType=Personal&DashboardType=MyPage'
    })

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    const response = await page.evaluate(() => {
      const arr = []
      document
        .querySelectorAll('#tasklist > div.tasklist2_container ul a')
        .forEach((el) => arr.push([el.href, el.getAttribute('aria-label')]))
      return arr
    })

    await browser.close()

    return response
  },
  openInBrowser: (url) => {
    shell.openExternal(url)
  },
})
