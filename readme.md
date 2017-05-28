#Overview of the online shop node.js application

The application is extensively commented, please see the jsdoc doc below for each of app.js and resource.js for further commented detail. 

* out/app.js.html - main application file.
* out/resource.js.html - contains the bulk of the code which was designed around a number of key module exports which are called in the main app.js file. 
* stationery.sql  - MySQL database create script included in the main project folder. This was run against WAMP 3.0.6 with MySQL version 5.7.14  

The shop application works as follows:

The node server is created and launches the home page. The homepage is generated from a header and footer html file and a read on a MySQL DB.  POST actions are used to push new content to the DB. jQuery reads values from the application pages, parses the values, and pushes them to the DB. GET actions are used to push data from the DB to the browser. A read is done of the various tables in the Products database every time the page is refreshed. 

When an entry is added to the orders or pencils tables, a unique ID is generated. Users can add, update and delete entries in the SQL tables.  

Node modules are included in /modules folder. a package.json is available in the main project folder. The node modules used are:
* node-static - this is used to serve resources. 
* mysql - used to talk to the MySQL DB.

#Features of the site:
Some of these features are not fully implemented.

* Users can view the product catalog and buy items, adding multiple items to their cart.
* The site has a simple nav bar
* The Products database has the following tables:
    -   Orders table
    -   Pencils table
* Browse page
    - add to cart button
* Cart page 
    - allow updates with quantities
    - buy now link
* Back office page 
    - for owner to manage stock levels

This doc was built with jsdoc.

    jsdoc studentrecs.js -d out  -r --readme README.md

Output is at out/index.html
