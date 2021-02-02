const Airtable = require("airtable");
const isValidEmail = require("is-valid-email");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (!isValidEmail(req.query.mail)) {
    res.status(500).send("Invalid Email");
  } else {
    const existingRecord = await base("waitlist").select({
      pageSize: 1,
      maxRecords: 1,
      filterByFormula: "{mail} = '" + req.query.mail + "'"
    }).firstPage()
    if (existingRecord.length > 0) {
      res.status(500).send("Already registered");
    } else {
      const records = await base("waitlist").create([
        {
          fields: {
            mail: req.query.mail,
          },
        },
      ]);
      res.json(records);
    }
  }
};
