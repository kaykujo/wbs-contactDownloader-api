# wbs-contactDownloader-api
API to grab data from SQL Server

### Purpose
A small API used by my android app to grab contact data from MSSQL, and update their status to `downloaded` after completed.
I am using [seriate](https://github.com/LeanKit-Labs/seriate) to connect to our SQL Server and execute stored procedures created in our DB.

This is the first step in my whole **Whatsapp Blaster** system, which consists of multiple components.

### Instructions
1.  copy `sample.env` and rename it to `.env`
1.  run `npm install`
1.  run `node server.js`
