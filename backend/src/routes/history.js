const router = require('express').Router();
const { getHistory, getOne, deleteOne, clearHistory } = require('../controllers/historyController');
router.get('/', getHistory);
router.get('/:id', getOne);
router.delete('/clear', clearHistory);
router.delete('/:id', deleteOne);
module.exports = router;
