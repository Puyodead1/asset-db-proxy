const express = require("express");
const { query, validationResult } = require("express-validator");
const fetch = require("node-fetch").default;

const app = express();

app.get("/ping", (req, res) => {
  return res.send("Pong!");
});

app.get(
  "/search",
  query("q").isString().notEmpty({ ignore_whitespace: false }),
  query("count").isNumeric().optional(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = req.query.q;
    const count = req.query.count ?? 20;

    return fetch(
      `https://www.unrealengine.com/marketplace/api/assets?lang=en-US&start=0&count=${count}&sortBy=relevancy&sortDir=DESC&keywords=${query}`
    )
      .then((res) => res.json())
      .then(res.json)
      .catch((e) => {
        console.error(e);
        return res.status(400).json({ error: e.message });
      });
  }
);

const port = process.env.PORT || "8081";
app.listen(port, () => {
  console.log(`Epic Proxy listening on port ${port}`);
});
