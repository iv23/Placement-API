const express = require('express');
const router = express.Router();;
const Student = require('../db/studentModel');
const Company = require('../db/companyModel');
require("response-codes");
//Logging library winston
const logger = require('../logger');

/*Handles error by logging error and sending response with appropriate status code and message.*/
function errorHandler(err, res, statusCode) {
    err.statusCode = statusCode;
    logger.error(err);
    res.status(err.statusCode).json({errorCode : err.statusCode, errorMessage : err.message});
}

/* GET home page. */
router.get('/', function(req, res){
    res.OK('');
});

/*GET all students in the student collection.*/
router.get('/api/student', function (req, res) {
    Student.getStudents(function (err, students) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(students);
        logger.info("All students JSON "+JSON.stringify(students));
    });
});

/*GET a student from the collection with _id given as parameter.*/
router.get('/api/student/:_id', function (req, res) {
    Student.getStudentById(req.params._id, function (err, student) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(student);
        logger.info("Student JSON "+JSON.stringify(student));
    });
});


/*POST a student object into the student collection.*/
router.post('/api/student', function (req, res) {
    const student = req.body;
    Student.addStudent(student, function (err, student) {
        if (err){
            errorHandler(err, res, 422);
        }
        else {
            const responseJSON = {
                message: "Student created. Please use register and unregister links to register and unregister for company.",
                unregisterLink: "/api/student/unregister/:studentId/from/:companyId",
                registerLink: "/api/student/register/:studentId/for/:companyId"
            };
            logger.info("Student JSON "+JSON.stringify(student));
            /*Response code 201(Created) as company resource is created in the collection*/
            res.CREATED(JSON.stringify(responseJSON));
        }
    });
});

/*PUT the updated student object in the collection.*/
router.put('/api/student/:_id', function (req, res) {
    const id = req.params._id;
    const student = req.body;
    logger.info(JSON.stringify(student));
    Student.updateStudent(id, student, {new : true}, function (err, student) {
        if (err){
            errorHandler(err, res, 422);
        }
        logger.info("Updated student JSON "+JSON.stringify(student));
        res.json(student);
    });
});

/*DELETE a student from the student collection with its _id given as a parameter.*/
router.delete('/api/student/:_id', function (req, res) {
    const id = req.params._id;
    var deleted;
    Student.getStudentById(id, function (err, student) {
        if (err){
            errorHandler(err, res, 500);
        }
        deleted = student;
    });
    Student.deleteStudent(id, function (err, student) {
        if (err){
            errorHandler(err, res, 500);
        }
        res.json(deleted);
    });
});

/*PATCH a company collection to register a student for the company.*/
router.patch('/api/student/register/:_sid/:_cid', function (req, res) {
    const studentId = req.params._sid,companyId = req.params._cid;
    const update = {
        $addToSet: {students: studentId}
    };
    const query = {_id : companyId};
    Company.findOneAndUpdate(query, update, {new : true}, function (err, company) {
        if (err){
            errorHandler(err, res, 500);
        }
        else {
            Company.listStudents(company._id, function (err, company) {
                if (err){
                    throw err;
                }
                logger.info("Company JSON(after registration) = "+JSON.stringify(company));
                res.json(company);
            });
        }
    });
});

/*PATCH a company collection to un-register a student from the company.*/
router.patch('/api/student/unregister/:_sid/:_cid', function (req, res) {
    const update = {
        $pull: {students: req.params._sid}
    };
    const query = {_id : req.params._cid};
    Company.findOneAndUpdate(query, update, {new : true}, function (err, company) {
        if (err){
            errorHandler(err, res, 500);
        }
        else {
            if (company.students != null){
                Company.listStudents(company._id, function (err, company) {
                    if (err){
                        throw err;
                    }
                    logger.info("Company JSON(after un-registration) = "+JSON.stringify(company));
                    res.json(company);
                });
            }
            else {
                logger.info("Company JSON(after un-registration) = "+JSON.stringify(company));
                res.NO_CONTENT("No such registration exists.");
            }
        }
    });
});

module.exports = router;