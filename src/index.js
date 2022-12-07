const puppeteer = require('puppeteer');

const urlAlvo = 'https://consultas.anvisa.gov.br/#/documentos/tecnicos/';
const protocolo = '25352238474201809';

(async () => {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        slowMo: 140,
    });
    const page = await browser.newPage();

    await page.goto(urlAlvo);
    await console.log(`Consultando protocolo ${protocolo}`);

    //Nesta seção o protocolo é Digitado.
    await page.waitForSelector('div:nth-child(5) > input');
    await page.type('div:nth-child(5) > input',protocolo);

    //Nesta seção clica no botão consultar.
    await page.waitForSelector('.btn.btn-primary');
    await page.click('.btn.btn-primary');

    //webscraping
    const situacao = await page.$eval('tr.ng-scope > td:nth-child(7)',(el)=>el.textContent || false);
    const cnpj = await page.$eval('tr.ng-scope > td:nth-child(3)',(el)=>el.textContent || false);
    const razao_social = await page.$eval('tbody > tr.ng-scope > td:nth-child(4)',(el)=>el.textContent || false);

    const rz_social = razao_social.replace('/', '_');
    

    //Gerando relatório em PDF
    await page.waitForSelector('tbody > tr.ng-scope > td:nth-child(4)');
    await page.click('tbody > tr.ng-scope > td:nth-child(4)');
    await console.log('Gerando PDF...');
    await page.waitForSelector('div:nth-child(4) > div');
    await page.pdf({
        path:`./CONSULTA-PROTOCOLO-${rz_social}.pdf`, format:'A4'
    })

    // await browser.close();
})();