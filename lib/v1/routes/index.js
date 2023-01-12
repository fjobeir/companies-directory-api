var express = require('express');
var router = express.Router();

const adminsRouter = require('./admins')
const adsRouter = require('./ads')
const articlesRouter = require('./articles')
const categoriesRouter = require('./categories')
const citiesRouter = require('./cities')
const companiesRouter = require('./companies')
const contactsRouter = require('./contacts')
const languagesRouter = require('./languages')
const provincesRouter = require('./provinces')
const usersRouter = require('./users')

/* GET home page. */
router.use('/admins', adminsRouter);
router.use('/ads', adsRouter);
router.use('/articles', articlesRouter);
router.use('/categories', categoriesRouter);
router.use('/cities', citiesRouter);
router.use('/companies', companiesRouter);
router.use('/contacts', contactsRouter);
router.use('/languages', languagesRouter);
router.use('/provinces', provincesRouter);
router.use('/users', usersRouter);

module.exports = router;
