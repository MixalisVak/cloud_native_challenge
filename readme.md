# CMS API

This is a simple CMS (Content Management System) API built with Node.js, Express, and MySQL2. The API allows users to perform CRUD operations on articles and manage images associated with those articles. The API also supports user authentication with roles: **Admin** (can manage content) and **Guest** (can only view content).

## Features

- **User Authentication**: Admin users can log in and receive a JWT token for authorization.
- **Article Management**: Admins can create, update, delete articles. Guests can view articles.
- **Image Management**: Admins can upload images and associate them with articles. Guests can view images.
- **Role-Based Access**: Admins can manage content, while Guests can only read articles and view images.

## Prerequisites

To run this project locally, you need:

- [Node.js](https://nodejs.org/en/) (version 16.x recommended)
- [MySQL](https://www.mysql.com/) installed and running
- [Postman](https://www.postman.com/) or any API testing tool to test the API

## Installation

1. **Clone the repository**:
   Open a terminal, and run:
   ```bash
   git clone https://github.com/MixalisVak/cloud_native_challenge.git


2. **Install the dependencies**
    Run "npm install"

3. **Create a .env file in the root directory with the following contents**:
    DB_HOST=host_of_the_db
    DB_USER=user_of_the_db
    DB_PASSWORD=your_password_here
    DB_NAME=your_db_name
    DB_PORT= port_of_the_db
    JWT_SECRET=your_generated_jwt_secret_here

4. **Create the MySQL database and tables**:
    CREATE DATABASE your_database_name;
    USE your_database_name;

    CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    article_id INT
    );

    CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_id INT,
    FOREIGN KEY (image_id) REFERENCES images(id)
    );

    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'guest') NOT NULL
    );

5. **Create A user**
    Create an "admin" user, so you can test the APIs"
    1. Create a hashed password through the hashPassword.js file.
    2. Get this hashed_password and create a user in the DB
    3. INSERT INTO users (username, password, role) VALUES ('your_username', 'your_hashed_pass', 'user_role');



You are now ready to test the API.

