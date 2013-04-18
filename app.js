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

/*
var OAuth = require('oauth').OAuth;

var oauth_token = false;
var oauth_token_secret = false;


app.get('/request_token', function(req, res) {    
    var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        process.env.TUMBLR_API_CONSUMER_KEY,
        process.env.TUMBLR_API_CONSUMER_SECRET,
        "1.0",
        "http://pretty-colors.herokuapp.com/callback",
        "HMAC-SHA1"
    );

    oa.getOAuthRequestToken(function(error, _oauth_token, _oauth_token_secret, results){
        if(error) {
            console.log('error');
            console.log(error);
        } else {
            oauth_token = _oauth_token;
            oauth_token_secret = _oauth_token_secret;
            res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauth_token);
        }
    });
});

app.get('/callback', function(req, res){

    var oa = new OAuth(
        "http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        process.env.TUMBLR_API_CONSUMER_KEY,
        process.env.TUMBLR_API_CONSUMER_SECRET,
        "1.0",
        "http://pretty-colors.herokuapp.com/callback",
        "HMAC-SHA1"
    );

    oa.getOAuthAccessToken(
        oauth_token, 
        oauth_token_secret,
        req.query.oauth_verifier, 
        function(error, oauth_access_token, oauth_access_token_secret, results2) {
            if (error) {
                console.log('error');
                console.log(error);
            } else {
                console.log('oauth_access_token: ' + oauth_access_token);
                console.log('oauth_access_token_secret: ' + oauth_access_token_secret);
            }

            res.send('check the logs');
    });
});
*/

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
