const router = require(`express`).Router();

//== Static ==//
router.get(`/`, (req, res) => {
    res.render(`static/index`);
});
router.get(`/about`, (req, res) => {
    res.render(`static/about`);
});
router.get(`/contact`, (req, res) => {
    res.render(`static/contact`);
});
router.get(`/consulting-info`, (req, res) => {
    res.render("static/consulting-info");
});

module.exports = router;

