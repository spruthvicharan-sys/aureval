const router = require('express').Router();
const { evaluate } = require('../controllers/evaluateController');
router.post('/', evaluate);
module.exports = router;
