const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base(process.env.AIRTABLE_BASE);

module.exports = (req, res, next) => {
  base("waitlist").create(
    [
      {
        fields: {
          mail: "iulian@rotaru.fr",
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
      res.json({
        body: req.body,
        query: req.query,
        cookies: req.cookies,
      });
    }
  );
};