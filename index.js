const puppeteer = require("puppeteer");
const fs = require("fs");
const sanitizer = require("string-sanitizer");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage({ headless: false });

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    // write your querySelectors here
    // All selectors return only one HTML element
    // Used only id for description because it is unique
    return {
      description: document.querySelector("#description").innerText,
      title: document.querySelector("#detail-description-container > h2")
        .innerText,
      price: document.querySelector("#detail-title > .price").innerText,
      address: document.querySelector("#detail-title > .address").innerText,
    };
  });

  console.log(items);
  browser.close();

  return items;
};
main().then((data) => {
  data.description = sanitizer.sanitize.keepSpace(data.description); // This will sanitize the description field
  console.log(data);
  fs.writeFile("./data.json", JSON.stringify(data, null, 4), function (err) {
    if (err) {
      console.log(err.message);
    }
  });
});
