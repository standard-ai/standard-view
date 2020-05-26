// index.js
/* eslint-disable @typescript-eslint/no-var-requires */
const dev = require("./lib");
const prod = require("./dist");
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = dev;
if (process.env.NODE_ENV === "production") {
  module.exports = prod;
}
