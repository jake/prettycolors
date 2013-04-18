var express = require('express');
var tumblr = require('./lib/tumblr.js');

var app = express();

var client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_API_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_API_CONSUMER_SECRET,
    token: process.env.TUMBLR_API_TOKEN,
    token_secret: process.env.TUMBLR_API_TOKEN_SECRET
});

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.post('/submit', function(req, res){
    client.photo('prettycolors', {
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

app.get('/*', function(req, res){
    res.redirect('http://prettycolors.tumblr.com/');
    res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
