const router = require('express').Router();
const { generate } = require('../controllers/generateController');
router.post('/', generate);
module.exports = router;
