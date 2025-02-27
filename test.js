const { chromium } = require("playwright");

async function pref(empresaId) {
  try {
    const browser = await chromium.launch({
      headless: false,
      slowMo: 50,
    });

    const page = await browser.newPage();
    await page.goto("https://www.gp.srv.br/tributario/sinop/portal_login?1");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
    await page.fill("#vUSUARIO_LOGIN", "03.300.663/0001-10");
    await page.fill("#vUSUARIO_SENHA", "923m5koq5");
    await page.click("#BTN_ENTER3");
    await page.waitForSelector("#TB_TITULO", { state: "visible" });
    console.log("entrei pref");

    const selectElement = await page.$("#vPAGESIZE"); // Usando o id 'vPAGESIZE'
    await selectElement.selectOption({ label: "120" });
    await page.waitForSelector(".Form.gx-masked", { state: "visible" });
    await page.waitForSelector(".Form.gx-masked", { state: "hidden" });
    console.log("Ponto, carreado os 120 arquivos!");
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    // throw error;
  }
}
// await browser.close();

module.exports = { pref }; // Exportando a função
