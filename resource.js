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
        "Name", "Hardness", "Thickness", "Description", "Image", "Buy it Now"
    ];
    var query = "SELECT * FROM pencils ";
    connection.query(
        query,
        function(err, rows) {
            if (err) throw err;
            html = exports.shopHtml(rows);
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
                html += '<td>' + '<img src="http://localhost:5000/' + rows[i].image_url + '">' + '</img>' + '</td>'
                html += '<td><form method="post" action="/buy(' + rows[i].id + ')">' + '<button type="submit" align="center">Add to Cart</button>' + '</form></td>'
                html += '</tr>';
            }
            html += "</table>"
            //html += exports.workFormHtml();
            exports.sendHtml(res, html);
        }
    );
};

exports.showShop = function(connection, res) {
    exports.show(connection, res, true);
};

exports.shopHtml = function(rows) {
    var html = fs.readFileSync("./header.html", 'utf8');
    return html;
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
