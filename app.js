var express = require('express');
var tumblr  = require('./lib/tumblr.js');
var mysql   = require('mysql');

var app = express();

function get_client_ip(req) {
    var ip_address = false;

    // Amazon EC2 / Heroku workaround to get real client IP
    if (req.header('x-forwarded-for')) {
        // 'x-forwarded-for' header may return multiple IP addresses in the format:
        // "client IP, proxy 1 IP, proxy 2 IP" so take the the first one
        ip_address = req.header('x-forwarded-for').split(',')[0];
    }

    if (! ip_address) {
        ip_address = req.connection.remoteAddress;
    }

    return ip_address;
};

var tumblr_client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_API_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_API_CONSUMER_SECRET,
    token: process.env.TUMBLR_API_TOKEN,
    token_secret: process.env.TUMBLR_API_TOKEN_SECRET
});

var mysql_connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.post('/submit', function(req, res){
    var mysql_params = {
        hex: req.body.hex.replace('#', ''),
        submitted_ip: get_client_ip(req),
    };

    mysql_connection.query('INSERT INTO colors SET ?', mysql_params, function(err, data){
        if (err) console.log(err);
        console.log(data);

        tumblr_client.photo('prettycolors', {
            state: 'queue',
            tags: 'prettycolors',
            data64: req.body.base64,
            caption: req.body.hex,
        }, function(err, data){
            if (err) console.log(err);
            console.log(data);

            res.redirect('http://prettycolors.tumblr.com/');
            res.end();
        });
    });
});

app.get('/*', function(req, res){
    res.redirect('http://prettycolors.tumblr.com/');
    res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
