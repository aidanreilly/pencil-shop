var qs = require('querystring');
var fs = require('fs');

/*
The sendHtml function is used as the 'front end' through which all the other functions send their html.  
 */
exports.sendHtml = function(res, html) {
    //res.setHeader('Content-Type', 'text/html');
    //res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

/*
The parseReceivedData function is used to parse incoming data.
 */
exports.parseReceivedData = function(req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { body += chunk });
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    });
};

/*
The action form function is used to receive data from the forms in the application and update the DB accordingly.
 */
exports.actionForm = function(id, path, label) {
    var html = '<form method="POST" action="' + path + '">' +
        '<input type="hidden" name="id" value="' + id + '">' +
        '<input type="submit" value="' + label + '" />' +
        '</form>';
    return html;
};

/*
addToCart module selects an entire row from the Pencil table and inserts it verbatim into the orders table. The columns on both tables are identical for this purpose.
 */
exports.addToCart = function(connection, req, res) {
    exports.parseReceivedData(req, function(pencils) {
        connection.query(
            "INSERT INTO orders (price, name, hardness, thickness, description, image_url, stock) SELECT price, name, hardness, thickness, description, image_url, stock FROM pencils where id=?", [pencils.id],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

/*
addToStock module allows the Owner to insert a new stock record into the Pencils table on the DB. 
 */
exports.addToStock = function(connection, req, res) {
    exports.parseReceivedData(req, function(pencils) {
        connection.query(
            "INSERT INTO pencils (price, name, hardness, thickness, description, image_url, stock) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?)", [pencils.price, pencils.name, pencils.hardness, pencils.thickness, pencils.description, pencils.image_url, pencils.stock],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

/*
Delete is used to delete a row from the pencils table on the DB. 
 */
exports.delete = function(connection, req, res) {
    exports.parseReceivedData(req, function(pencils) {
        connection.query(
            "DELETE FROM pencils WHERE id=?", [pencils.id],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

/*
Remove is used to delete a row from the orders table on the DB. 
 */
exports.remove = function(connection, req, res) {
    exports.parseReceivedData(req, function(pencils) {
        connection.query(
            "DELETE FROM orders WHERE id=?", [pencils.id],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

/*
Show is the default entry point into the application. This function builds a html table using a pencils DB table, and top and tails it with a header and footer. The applcation makes use of the node-static module to serve images. Image file names are recorded in the DB and served on port 5000 via a static file server. static files are hosted in a /public folder which Node exposes to the browser to present the static resources.
 */
exports.show = function(connection, res) {
    var Tableheaders = [
        "Name", "Hardness", "Thickness (mm)", "Description", "Price (€)", "Image", "Buy it Now"
    ];
    var query = "SELECT * FROM pencils ";
    connection.query(
        query,
        function(err, rows) {
            if (err) throw err;
            html = fs.readFileSync("./header.html", 'utf8');
            html += "<table border=1 width=100%>";
            html += '<tr style="font-size: 20px;" >';
            var i;
            for (i = 0; i < Tableheaders.length; i++) {
                html += '<th>' + Tableheaders[i] + '</th>';
            }
            html += '</tr>';
            for (var i = 0; i < rows.length; i++) {
                html += '<tr style="font-size: 20px;" >';
                html += '<td>' + rows[i].name + '</td>';
                html += '<td>' + rows[i].hardness + '</td>';
                html += '<td>' + rows[i].thickness + '</td>';
                html += '<td>' + rows[i].description + '</td>';
                html += '<td>' + rows[i].price + '</td>';
                html += '<td align="center">' + '<img src="http://localhost:5000/' + rows[i].image_url + '" style="max-width: 150px">' + '</img>' + '</td>'
                html += '<td>' + exports.addtoCartForm(rows[i].id) + '</td>';
                html += '</tr>';
            }
            html += "</table>"
            html += fs.readFileSync("./footer.html", 'utf8');
            exports.sendHtml(res, html);
        }
    );
};

/*
About is a simple 'About' page that makes use of a served image, the site header and footer. html is sent via the sentHtml function to app.js for final serving to the browser.  
 */
exports.about = function(connection, res) {
    var html = fs.readFileSync("./header.html", 'utf8');
    html += '<div class="container">'
    html += '<img  src="http://localhost:5000/Website_photo_1400x800.jpg" align="center"/>'
    html += '</div>'
    html += fs.readFileSync("./footer.html", 'utf8');
    exports.sendHtml(res, html);
};

/*
Thanks is a simple html page that makes use of a served image, the site header and footer. html is sent via the sentHtml function to app.js for final serving to the browser.  
 */
exports.thanks = function(connection, res) {
    var html = fs.readFileSync("./header.html", 'utf8');
    html += '<div class="container">'
    html += '<h1>Thank you!</h1>'
    html += '<p>We really appreciate your custom. Your package will ship on the next resourceing day. See you again soon hopefully :)</p>'
    html += '<img  src="http://localhost:5000/the_pencil_box_subscription_1024x1024.jpg" align="center"/>'
    html += '</div>'
    html += fs.readFileSync("./footer.html", 'utf8');
    exports.sendHtml(res, html);
};


/*
Cart presents a read on the orders table in the product DB and presents the contents of the table top and tailed with the site header and footer html. html is sent via the sentHtml function to app.js for final serving to the browser.  
 */
exports.cart = function(connection, res) {
    var Tableheaders = [
        "Name", "Description", "Price (€)", "Remove"
    ];
    var query = "SELECT * FROM orders ";
    connection.query(
        query,
        function(err, rows) {
            if (err) throw err;
            html = fs.readFileSync("./header.html", 'utf8');
            html += '<h1>Your Items</h1>'
            html += '<p>Press the buy button to buy the items. Thanks for your custom!</p>'
            html += "<table border=1 width=100%>";
            html += '<tr style="font-size: 20px;" >';
            var i;
            for (i = 0; i < Tableheaders.length; i++) {
                html += '<th>' + Tableheaders[i] + '</th>';
            }
            html += '</tr>';
            for (var i = 0; i < rows.length; i++) {
                html += '<tr style="font-size: 20px;" >';
                html += '<td>' + rows[i].name + '</td>';
                html += '<td>' + rows[i].description + '</td>';
                html += '<td>' + rows[i].price + '</td>';
                html += '<td>' + exports.remove(rows[i].id) + '</td>';                
                html += '</tr>';
            }
            html += "</table>"
            html += "<br>"
            html += '<a href="http://localhost:3000/thanks" target="_blank"><button id="buy">Buy Now!</button></a>'
            html += fs.readFileSync("./footer.html", 'utf8');
            exports.sendHtml(res, html);
        }
    );
};
/*
The backoffice function presents a read of the pencils table and exposes some other information that the owner needs, for example, the stock levels. Stock levels are not presented to the customer view for example.  
 */
exports.backoffice = function(connection, res) {
    var Tableheaders = [
        "Name", "Description", "Price", "Quantity in Stock", "Update", "Remove"
    ];
    var query = "SELECT * FROM pencils ";
    connection.query(
        query,
        function(err, rows) {
            if (err) throw err;
            html = fs.readFileSync("./header.html", 'utf8');
            html += '<h1>Back Office</h1>'
            html += "<p>Welcome to the stock room. Here you can update the items that are in stock. Use the 'Add New Stock Item' button below to add new items.</p>"
            html += "<table border=1 width=100%>";
            html += '<tr style="font-size: 20px;" >';
            var i;
            for (i = 0; i < Tableheaders.length; i++) {
                html += '<th>' + Tableheaders[i] + '</th>';
            }
            html += '</tr>';
            for (var i = 0; i < rows.length; i++) {
                html += '<tr style="font-size: 20px;" >';
                html += '<td>' + rows[i].name + '</td>';
                html += '<td>' + rows[i].description + '</td>';
                html += '<td>' + rows[i].price + '</td>';
                html += '<td>' + rows[i].stock + '</td>';

                html += '<td>' + exports.update(rows[i].id) + '</td>';    
                html += '<td>' + exports.delete(rows[i].id) + '</td>';                
                html += '</tr>';
            }
            html += "</table>"
            html += "<br>"
            html += '<a href="http://localhost:3000/addstock"><button id="buy">Add New Stock Item</button></a>'
            html += fs.readFileSync("./footer.html", 'utf8');

            exports.sendHtml(res, html);
        }
    );
};

/*
addStock is used to add new records to the DB.
 */
exports.addstock = function(connection, res) {
    var html = fs.readFileSync("./header.html", 'utf8');
    html += '<form method="POST" action="/">' +
        '<p>Price:<br/><input name="price" type="text"><p/>' +
        '<p>Name:<br/><input name="name" type="text"><p/>' +
        '<p>Hardness:<br/><input name="hardness" type="text"><p/>' +
        '<p>Thickness:<br/><input name="thickness" type="text"><p/>' +
        '<p>Description:<br/><input name="description" type="text"><p/>' +
        '<p>Image file name:<br/><input name="image_url" type="text"><p/>' +
        '<p>Stock level:<br/><input name="stock" type="text"><p/>' +
        '<input type="submit" value="Add" />' +
        '</form>';
    html += fs.readFileSync("./footer.html", 'utf8');
    exports.sendHtml(res, html);
};

/*
addToCartForm allows items to be added to the user cart. 
 */
exports.addtoCartForm = function(id) {
    return exports.actionForm(id, '/addtocart', 'Add to Cart');
}

/*
delete allows items to be removed from stock. 
 */
exports.delete = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
}

/*
delete allows items to be removed from stock. 
 */
exports.remove = function(id) {
    return exports.actionForm(id, '/remove', 'Remove from Order');
}

/*
update allows items to be updated in stock. 
 */
exports.update = function(id) {
    return exports.actionForm(id, '/update', 'Update Stock Levels');
}
