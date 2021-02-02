const Airtable = require("airtable");
const isValidEmail = require("is-valid-email");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

module.exports = (req, res, next) => {
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