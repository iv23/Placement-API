const mongoose = require('mongoose');
const Student = require('./studentModel');
const validate = require('mongoose-validator');
const validates = require('validator');

const nameValidator = [
    /*Validates that length of name should be between 3 to 50.*/
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    /*Validates that name should contain alpha characters only.*/
    validate({
        validator: 'isAlpha',
        passIfEmpty: true,
        message: 'Name should contain alpha characters only',
    }),
];

//Job Schema(optional). Not implemented.
const jobSchema = mongoose.Schema({
    position : {type : String, required : true},
    salary : {type : String, required : true},
    criteria : {type : String, required : true},
    jd : String,
    selectionProcess : String
});

//Company Schema
const companySchema = mongoose.Schema({
    name: {type : String, required : true, validator: nameValidator},
    jobs : [jobSchema],
    eventDate : {type : Date, required : true},
    students : [{type : mongoose.Schema.Types.ObjectId, ref : 'Student'}]
});

//Company Model
const companyModel  = mongoose.model('Company', companySchema);
const Company = module.exports = companyModel;


//Get Company
module.exports.getCompanyById = function (id, callback) {
    Company.findById(id, callback);
};

//Register Company
module.exports.registerCompany = function (company, callback) {
    Company.create(company, callback);
};

//Unregister Company
module.exports.unregisterCompany = function (id, callback) {
    const query = {_id : id};
    Company.remove(query, callback);
};

//Update Company
module.exports.registerStudent = function (id, update, options, callback) {
    const query = {_id : id};
    Student.findOneAndUpdate(query, update, options, callback);
};

//List Students
module.exports.listStudents = function (id, callback) {
    const result = Company.findById(id).populate('students').exec(callback);
};