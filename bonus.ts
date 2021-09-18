import puppeteer from "puppeteer";
import * as fs from "fs";
import * as sanitizer from "string-sanitizer";

export class Item {
  public description: string | undefined | null;
  public title: string | undefined | null;
  public price: string | undefined | null;
  public address: string | undefined | null;
}

const PAGE_URL: string =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
  });
  const page: puppeteer.Page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items: Item = await page.evaluate(() => {
    return {
      description: document.querySelector("#description")?.innerHTML,
      title: document.querySelector("#detail-description-container > h2")
        ?.textContent,
      price: document.querySelector("#detail-title > .price")?.textContent,
      address: document.querySelector("#detail-title > .address")?.textContent,
    };
  });
  browser.close();
  return items;
};

main().then((data) => {
  data.description = sanitizer.sanitize.keepSpace(data.description!);
  console.log(data);
  fs.writeFile("./data_ts.json", JSON.stringify(data, null, 4), function (err) {
    if (err) {
      console.log(err.message);
    }
  });
});
