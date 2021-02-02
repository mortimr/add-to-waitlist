const Airtable = require("airtable");

Airtable.configure({
  apiKey: process.env.AIRTABLE_KEY,
});

module.exports = (req, res) => {
  console.log(req.query);
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  });
};
