const express = require('express');
const router = express.Router();
const { getData } = require('../controllers/dataController');

router.get('/', getData);

module.exports = router;
