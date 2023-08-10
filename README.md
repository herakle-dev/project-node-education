# PROJECT NODE EDUCATION
This is a Node.js project that provides a simple API for managing courses,
typologies, universities, and their relationships. It uses the MySQL database for data storage and retrieval.

# Table of Contents
- [Setup](#setup)
- [Prerequisites](#prerequisites) 
- [Installation](#installation)
- [Configuration](#configuration) 
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshot](#screenshot)
##  Setup

For local development and testing of the project, I used XAMPP as the SQL server to provide a MySQL database. XAMPP provides an easy way to set up a local web server environment that includes Apache, MySQL, PHP, and more.

### Prerequisites

Before you begin, make sure you have XAMPP installed on your machine. You can download XAMPP from the [official website](https://www.apachefriends.org/index.html).
To test the APIs and endpoints of this project, you can use API testing tools like Insomnia or Postman. Here's how you can get started:
- [Download and install Insomnia](https://insomnia.rest/download).
- [Download and install Postman](https://www.postman.com/downloads/).
  
 Make sure you have the project's server running while testing the APIs using these tools. This will allow you to interact with your APIs and observe their behavior.

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/herakle-dev/project-node-education.git
   ```
 2.  Navigate to the project directory:

```bash
  cd project-node-education
   ```
3. Install dependencies
```bash
npm install
   ```
### Configuration

1. Start XAMPP and ensure that the Apache and MySQL services are running.

2. Access the MySQL database using the phpMyAdmin interface. You can usually access it by navigating to [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your web browser.

3. Import the [  migration.sql ](./migration.sql) file in the phpMyAdmin browser interface 

4. Create the `.env` file in your project directory with the database settings:

 ```javascript
DB_USER=root
DB_PASSWORD=
DB_NAME=node_education
DB_HOST=localhost
DB_PORT=3306
```

# Usage 
1. Run index.js file with  this script
 ```bash
npm start
   ```
#### or 
 ```bash
node index.js
   ```
2. Now with the local server running you can test API endpoint!

# API Endpoints

## Courses

- **GET /api/courses**: Get the list of all courses.
- **GET /api/courses/:course_id**: Get details of a specific course.
- **GET /api/courses/typology/:TYPOLOGY_ID**: Get the list of courses filtered by typology.
- **POST /api/courses/:course_name/:TYPOLOGY_ID**: Add a new course specifying the name and typology ID.
- **PUT /api/courses/:COURSE_ID**:
  Update an existing course's information.
  - Query Parameters:
    - new_name: Insert the new course name.
    - new_typology: Insert the new typology ID (must exist).
- **DELETE /api/courses/:course_id**: Delete a specific course.

## Typologies

- **GET /api/typology**: Get the list of all typologies.
- **GET /api/typology/:typology_id**: Get details of a specific typology.
- **POST /api/typology/:new_typology_name**: Add a new typology specifying the name.
- **PUT /api/typology/:typology_id**:
  Update the name of an existing typology.
  - Query Parameters:
    - new_typology_name: Insert the new typology name.
- **DELETE /api/typology/:typology_id**: Delete a specific typology.

## Universities

- **GET /api/university**: Get the list of all universities.
- **GET /api/university/:university_id**: Get details of a specific university.
- **POST /api/university/:university_city/:university_name**: Add a new university specifying the city and name.
- **PUT /api/university/:UNIVERSITY_ID**:
  Update an existing university's information.
  - Query Parameters:
    - new_name: Insert the new university name.
    - new_city: Insert the new city name.
- **DELETE /api/university/:university_id**: Delete a specific university.

## Course-University Relations

- **GET /api/relation**: Get the list of relations between courses and universities.
- **GET /api/relation/search**:
  Search relations based on course name or typology name.
  - Query Parameters:
    - course_name: Specify the course name for filtering.
    - typology_name: Specify the typology name for filtering.
- **POST /api/relation**:
  Add a new relation between a course and a university specifying IDs.
  - Query Parameters:
    - course_id: Specify the course ID (must exist).
    - university_id: Specify the university ID (must exist).
- **PUT /api/relation/:relation_id**:
  Update an existing relation between a course and a university.
  - Query Parameters:
    - course_id: Specify the updated course ID (must exist).
    - university_id: Specify the updated university ID (must exist).
# Screenshot
- Test screenshot
  ![](Screenshot/test.jpg)
