const mongoose = require('mongoose');
const validate = require('mongoose-validator');

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

const rnValidator = [
    /*Validates that roll number should contain alpha numeric characters only.*/
    validate(
        {
            validator: 'isAlphanumeric',
            passIfEmpty: true,
            message: 'Roll Number should contain alpha numeric characters only',
        }),
    /*Validates that length of roll number should be between 7 to 8.[14CSU082/13BSC12]*/
    validate(
        {
            validator: 'isLength',
            arguments: [7, 8],
            message: 'Roll Number should be between {ARGS[0]} and {ARGS[1]} characters',
        }),
];
/*nameValidator for validating name. rnValidator for validating roll number. setter for rollNo for sanitization*/
const studentObj = {
    firstName : {type : String, required : true, validate: nameValidator},
    lastName : {type : String, required : true, validate: nameValidator},
    rollNo : {type : String, required : true, unique: true, validate: rnValidator, set: function (val) {
            return val.toString().toUpperCase();
        }},
    department : {type : String, required : true},
    cgpa : {type : Number, required : true, min : 0, max : 10}
};

//Student Schema

const studentSchema = mongoose.Schema(studentObj);

const Student = module.exports = mongoose.model('Student',studentSchema);

//Add Student
module.exports.addStudent = function (student, callback) {
    Student.create(student, callback);
};

//Get Student
module.exports.getStudentById = function (id, callback) {
    Student.findById(id, callback);
};

//Get Students
module.exports.getStudents = function (callback, limit) {
    Student.find(callback).limit(limit);
};

//Update Student
module.exports.updateStudent = function (id, student, options, callback) {
    const query = {_id : id};
    const update = {
        firstName : student.firstName,
        lastName : student.lastName,
        rollNo : student.rollNo,
        department : student.department,
        cgpa : student.cgpa
    };
    Student.findOneAndUpdate(query, update, options, callback);
};

//Delete Student
module.exports.deleteStudent = function (id, callback) {
    const query = {_id : id};
    Student.remove(query, callback);
};