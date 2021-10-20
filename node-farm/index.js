const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////////
//read file from system
//example of sync Blocking code
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf8");
// console.log(textIn);

// const textOut = `this is what we know about avocado ${textIn}. created on ${Date.now()}`;
// fs.writeFileSync("./starter/txt/output.txt", textOut);
// console.log("the file has been written!");

//example of Async Non-blocking
// fs.readFile("./starter/txt/start.txt", "utf8", (err, data) => {
//   if (err) return console.log("ERROR !");
//   fs.readFile(`./starter/txt/${data}.txt`, "utf8", (err, data1) => {
//     console.log(data1);
//     fs.readFile("./starter/txt/append.txt", "utf8", (err, data2) => {
//       console.log(data2);
//       fs.writeFile(
//         "./starter/txt/output.txt",
//         `${data1}\n${data2}\n`,
//         "utf8",
//         (err) => {
//           console.log("the data has been written!");
//         }
//       );
//     });
//   });
// });
// console.log("data will be read ");

//////////////////////
//server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/card.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello from the other side",
    });
    res.end("<h1>this page is unavailable !</h1>");
    // res.end("this page is unavailable !");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server listening");
});
