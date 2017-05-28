/**
 * @file main application file for the pencil shop node.js application
 * @author Aidan Reilly 
 */

/**
 * http module is for sending and receiving http traffic in the node application. The http server processes requests and responses. The createServer method creates the server and sets it up to process requests and responses. The url var is parsed from the http req input. The request and URL is pushed to the console. The main body of the application is set up in the server object here. If the method is a POST method and has a "/" case encoded in the URL, print to the console, process the req request. The request on method processes the request body, binds it to the POST event. The various methods GET methods grab the content from the DB and the push to the the browser.
 * @module  http
 */
var http = require('http');

/**
 * mysql module connects the node application to the running DB, allowing data to nbe sent over and back. The connection uses the mysql connection to the db, with user root, default password, products DB. In production, this open pasword would be very dangerous.
 * @module  mysql
 */
var mysql = require('mysql');

/**
 * fs is for file i/o operations
 * @module fs
 */
var fs = require('fs');

/**
 * Path is for manipulating file paths, finding the basename, file type, etc.
 * @module path
 */
var path = require('path');

/**
 * imgserver is for serving static resources, html, links, images. Open on port 5000. Uses the node-static module. Images are served from inside the /public folder. only resources in this folder are served. 
 *  @module  imgserver
 */
var imgserver = require('node-static');

/*
 * The url module provides utilities for URL resolution and parsing. 
 * @module node-static
 */
var url = require('url');

/*
 * Resource is for the export modules that are used in the application they are called from resource.js in the main folder.
 * @module resource
 */
var resource = require('./resource');

/*
 * Connection for the MySQL DB.
 * @module connection
 */
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

var fileServer = new imgserver.Server('./public');

http.createServer(function(req, res) {
    fileServer.serve(req, res);

}).listen(5000);


//main body of application routing
/*
 *Server application runs the show and route the applcation res and req methods, access to the DB, etc.
 */
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
