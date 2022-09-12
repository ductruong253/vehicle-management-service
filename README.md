# vehicle-management-service
Capstone project of Udacity Cloud Developer

## Description
This application is a service that allow users (employees of a company) to register their vehicles to use company's parking service.
The application include with both serverless back-end and front-end modules.

## Note
This project is based on the starter code of project-04 in `cloud-developer` repository provided in Udacity Cloud Developer course.
All the deployment and run steps are similar to the project Serverless Application.

## Usage
### 1. Start-up client at local
Clone the repository to your local machine, then cd to `./client`, run the client service with command:

`npm run start`

After the UI started successfully on local machine, the new browser windows will be automatically show up with URL: `http://localhost:3000/`

At the first time use, user need to register for their account and login with that credential before registering any of their vehicles.

### 2. Register new vehicle
To register new vehicle, all the fields below should be provided:

- Make: vehicle maker (manufacturer), like Honda, Toyota, ...
- Model: vehicle model
- Year: version of the model coded by release year
- Color: original vehicle paint color
- VIN: vehicle identification number, should follow with the pattern like ##X#-##### where # are the digits and X is a single letter. (Ex: 58F1-12345)

Note that all the field are not allowed to start with spaces and minimum length should be 2.