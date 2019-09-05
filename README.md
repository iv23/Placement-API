# Placement-API
API that can be used for registering students and companies for a placement event.

## Steps for set up
1.) Run npm install in root folder containing package.json
2.) Start the server using the server.js file.
API URLs are as following :- 
1.) /api/student/_studentId (for GET,DELETE,PUT requests) 
2.) /api/student (for GET,POST requests) 
3.) /api/student/register/_studentId/_companyId (for PATCH request) 
4.) /api/student/unregister/_studentId/_companyId (for PATCH request) 
5.) /api/company (for GET, POST requests) 
6.) /api/company/_companyId (for GET,DELETE requests) Replace _studentId/_companyId with actual _id of student/company collection.
