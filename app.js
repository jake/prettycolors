var express = require('express');

var app = express();

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.post('/submit', function(req, res){
    console.log(req.body);
    res.send('asdf');
});

app.get('/*', function(req, res){
    res.writeHead(302, {
        'Location': 'http://prettycolors.tumblr.com/'
    });
    res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
