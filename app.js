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

//serve any images in the public folder on port
var fileServer = new static.Server('./public');
/*
The fileServer function
 */
http.createServer(function(req, res) {
    fileServer.serve(req, res);

}).listen(5000);

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    resource.addToStock(connection, req, res);
                    break;
                case '/addtocart':
                    resource.addToCart(connection, req, res);
                    break;
                case '/delete':
                    resource.delete(connection, req, res);
                    break;
                case '/remove':
                    resource.remove(connection, req, res);
                    break;                    
                case '/update':
                    resource.update(connection, req, res);
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
                    resource.cart(connection, res);
                    break;
                case '/backoffice':
                    resource.backoffice(connection, res);
                    break;
                case '/addstock':
                    resource.addstock(connection, res);
                    break;
                case '/about':
                    resource.about(connection, res);
                    break;
                case '/buy':
                    resource.show(connection, res);
                    break;
                case '/thanks':
                    resource.thanks(connection, res);
                    break;
            }
            break;
    }
});

console.log("Server running on localhost:3000")
server.listen(3000);
