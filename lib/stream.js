var emitter = require('./emitter');

var streams = {};

function register(name, stream) {
    streams[name] = stream;
};

function unregister(name) {
    delete streams[name];
};

function output(output) {
    for (i in streams) {
        streams[i].write(output);
    }
};

function get(name) {
    return streams[name] || false;
}

function start() {
    emitter.on('color', function(data){
        console.log('streaming color: %j', data);

        output(
            'event: color\n' +
            'data: ' + data + '\n\n'
        );
    });

    setInterval(function(){
        console.log('heartbeat; open streams: %j', Object.keys(streams));

        output(
            'event: heartbeat\n' +
            'data: ' + new Date().getTime() + '\n\n'
        );
    }, 20000);
};

exports.register = register;
exports.unregister = unregister;
exports.output = output;
exports.get = get;
exports.all = streams;
exports.start = start;
