var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');
var static = require('node-static');
var url = require('url');
var resource = require('./resource');


//set up the db connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'products'
});

connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting to the database");
    }
});


//table headers
//var Tableheaders = [
//   "Name", "Hardness", "Thickness", "Description", "Image", "Buy it Now"
//];

//serve any images in the public folder on port
var fileServer = new static.Server('./public');
/*
The fileServer function
 */
http.createServer(function(req, res) {
    fileServer.serve(req, res);

}).listen(5000);

//var server = http.createServer(function(req, res) {
//    var url = req.url;
//    console.log('Request starting: ' + url);
//    showPage(req, res, displayShop(true), "./footer.html");
//
//});

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    resource.add(connection, req, res);
                    break;
            }
            break;
        case 'GET':
            switch (req.url) {
                case '/':
                    resource.show(connection, res);
                    break;
                case '/shop':
                    resource.show(connection, res);
                    break;
                case '/cart':
                    resource.show(connection, res);
                    break;
                case '/back-office':
                    resource.show(connection, res);
                    break;
                case '/about':
                    resource.about(connection, res);
                    break;
                case '/buy':
                    resource.show(connection, res);
                    break;
            }
            break;
    }
});

console.log("Server running on localhost:3000")
server.listen(3000);
