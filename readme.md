#Node.JS Assignment 2 - Pencil me in onlien shop
Simple online shop with Node.js and SQL.

Node modules are included in /modules folder. 

##Shop requirements
* Customer user can view catalog, buy items
* Owner can view catalog, and view orders (time stamp, prod ID, etc)
* Nav bar
* Products DB table
* Orders table
* products  - unique id
* page footer
* product objects - unique ids
* browse page
    - add to cart button
    - cart page - allow updates with quantities
    - buy now link
* Back office for owner to manage stock levels

##Connection to WAMP MYSQL DB
open up wamp or cmd-line:

    mysql -u root -p
    root: <empty>

Import the db at cmd-line:

    source products.sql

pencil pics cogged from:
https://cwpencils.com/

Overview doc built with jsdoc.

    jsdoc app.js -d out  -r --readme README.md

output is at out/index.html