const Airtable = require("airtable");
const isValidEmail = require("is-valid-email");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

module.exports = (req, res, next) => {

  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (!isValidEmail(req.query.mail)) {
    next(new Error('Invalid email'));
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
        next(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
      res.json(records);
    }
  );
  }
};