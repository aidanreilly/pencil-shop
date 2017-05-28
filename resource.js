var qs = require('querystring');
var fs = require('fs');

exports.sendHtml = function(res, html) {
    //res.setHeader('Content-Type', 'text/html');
    //res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

exports.parseReceivedData = function(req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { body += chunk });
    req.on('end', function() {
        var data = qs.parse(body);
        cb(data);
    });
};

exports.actionForm = function(id, path, label) {
    var html = '<form method="POST" action="' + path + '">' +
        '<input type="hidden" name="id" value="' + id + '">' +
        '<input type="submit" value="' + label + '" />' +
        '</form>';
    return html;
};

exports.add = function(connection, req, res) {
    exports.parseReceivedData(req, function(work) {
        connection.query(
            "INSERT INTO work (hours, date, description) " +
            " VALUES (?, ?, ?)", [work.hours, work.date, work.description],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

exports.delete = function(connection, req, res) {
    exports.parseReceivedData(req, function(work) {
        connection.query(
            "DELETE FROM work WHERE id=?", [work.id],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

exports.archive = function(connection, req, res) {
    exports.parseReceivedData(req, function(work) {
        connection.query(
            "UPDATE work SET Shop=1 WHERE id=?", [work.id],
            function(err) {
                if (err) throw err;
                exports.show(connection, res);
            }
        );
    });
};

exports.show = function(connection, res) {
    var Tableheaders = [
        "Name", "Hardness", "Thickness (mm)", "Description", "Image", "Buy it Now"
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
                html += '<td align="center">' + '<img src="http://localhost:5000/' + rows[i].image_url + '" style="max-width: 150px">' + '</img>' + '</td>'
                html += '<td><form method="post" action="/buy(' + rows[i].id + ')">' + '<button type="submit" class="center">Add to Cart</button>' + '</form></td>'
                html += '</tr>';
            }
            html += "</table>"
            html += fs.readFileSync("./footer.html", 'utf8');
            //html += exports.workFormHtml();
            exports.sendHtml(res, html);
        }
    );
};

exports.about = function(connection, res) {
    var html = fs.readFileSync("./header.html", 'utf8');
    html += '<div class="container">'
    html += '<img  src="http://localhost:5000/Website_photo_1400x800.jpg" align="center"/>'
    html += '</div>'
    html += fs.readFileSync("./footer.html", 'utf8');
    exports.sendHtml(res, html);
};

exports.thanks = function(connection, res) {
    var html = fs.readFileSync("./header.html", 'utf8');
    html += '<div class="container">'
    html += '<h1>Thank you!</h1>'
    html += '<p>We really appreciate your custom. Your package will ship on the next working day. See you again soon hopefully :)</p>'
    html += '<img  src="http://localhost:5000/the_pencil_box_subscription_1024x1024.jpg" align="center"/>'
    html += '</div>'
    html += fs.readFileSync("./footer.html", 'utf8');
    exports.sendHtml(res, html);
};

exports.cart = function(connection, res) {
    var Tableheaders = [
        "Name", "Hardness", "Thickness (mm)", "Description"
    ];
    var query = "SELECT * FROM pencils ";
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
                html += '<td>' + rows[i].hardness + '</td>';
                html += '<td>' + rows[i].thickness + '</td>';
                html += '<td>' + rows[i].description + '</td>';
                html += '</tr>';
            }
            html += "</table>"
            html += "<br>"
            html += '<a href="http://localhost:3000/thanks" target="_blank"><button id="buy">Buy Now!</button></a>'
            html += fs.readFileSync("./footer.html", 'utf8');
            //html += exports.workFormHtml();
            exports.sendHtml(res, html);
        }
    );
};

exports.backoffice = function(connection, res) {
    var Tableheaders = [
        "Name", "Description", "Quantity in Stock", "Update"
    ];
    var query = "SELECT * FROM pencils ";
    connection.query(
        query,
        function(err, rows) {
            if (err) throw err;
            html = fs.readFileSync("./header.html", 'utf8');
            html += '<h1>Back Office</h1>'
            html += '<p>Welcome to the stock room. Here you can update the items that are in stock.</p>'
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
                html += '<td>' + rows[i].stock + '</td>';
                html += '<td><form>' + '<button type="submit" class="center">Update Stock Levels</button>' + '</form></td>'
                html += '</tr>';
            }
            html += "</table>"
            html += "<br>"
            html += '<a href="#"><button id="buy">Add New Stock Item</button></a>'
            html += fs.readFileSync("./footer.html", 'utf8');
            //html += exports.workFormHtml();
            exports.sendHtml(res, html);
        }
    );
};







//exports.workFormHtml = function() {
//    var html = '<form method="POST" action="/">' +
//        '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
//        '<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
//        '<p>Description:<br/>' +
//        '<textarea name="description"></textarea></p>' +
//       '<input type="submit" value="Add" />' +
//        '</form>';
//    return html;
//};

exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Add to Cart');
}

exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
}
