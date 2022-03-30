const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
    db.run("INSERT INTO user VALUES ('holson', 'phil', 'Administrator')");
});
 
//render the index file at this route
app.get('/', (req, res) =>{
     res.sendFile('index.html')
 })

 //using req.body, get user info
 app.post('/login', (req, res) =>{
     const username = req.body.username
     const password = req.body.password

     const query = "SELECT title FROM user WHERE username = '"+ username + "' AND password = '"+ password +"'";
     console.log(username)
     console.log(password)
     console.log(query)

     db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
		}
	});

 })
//listened on port 3000
 app.listen(3000, ()=>{
     console.log("Running on port 3000")
 })