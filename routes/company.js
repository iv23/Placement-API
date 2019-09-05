const express = require('express');
const router = express.Router();
const Company = require('../db/companyModel');
//Logging library winston
const logger = require('../logger');

/*Handles error by logging error and sending response with appropriate status code and message.*/
function errorHandler(err, res, statusCode) {
    err.statusCode = statusCode;
    logger.error(err);
    res.status(err.statusCode).json({errorCode : err.statusCode, errorMessage : err.message});
}

/*GET a company from the collection with _id given as parameter.*/
router.get('/api/company/:_id', function (req, res) {
    Company.listStudents(req.params._id, function (err, company) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(company);

        logger.info("Company JSON = "+JSON.stringify(company));
    });
});

/*GET all companies from the collection.*/
router.get('/api/company/', function (req, res) {
    Company.find().populate('students').exec(function (err, companies) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(companies);
        logger.info("Company JSON = "+JSON.stringify(companies));
    });
});

/*DELETE a company from the collection with _id given as parameter.*/
router.delete('/api/company/:_id', function (req, res) {
    const id = req.params._id;
    var deleted;
    Company.getCompanyById(id, function (err, company) {
        if (err){
            errorHandler(err, res, 500);
        }
        deleted = company;
    });
    Company.unregisterCompany(id, function (err, company) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(company);
    });
});

/*POST a company in the collection.*/
router.post('/api/company', function (req, res) {
    const company = req.body;
    company.eventDate = new Date(company.eventDate);
    Company.registerCompany(company, function (err, company) {
        if (err){
            errorHandler(err, res, 422);
        }
        /*Response code 201(Created) as company resource is created in the collection*/
        res.status(201).json(company);
    });
});


module.exports = router;