const Airtable = require("airtable");
const isValidEmail = require("is-valid-email");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

module.exports = (req, res) => {
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
    base("waitlist")
      .find(req.query.mail)
      .then((res) => {
        if (res) {
          res.status(500).send("Already registered");
        } else {
          base("waitlist").create(
            [
              {
                fields: {
                  mail: req.query.mail,
                },
              },
            ],
            function (err, records) {
              if (err) {
                console.error(err);
                res.status(500).send("Error while creating");
                return;
              }
              records.forEach(function (record) {
                console.log(record.getId());
              });
              res.json(records);
            }
          );
        }
      });
  }
};
