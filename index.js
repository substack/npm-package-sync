var fs = require('fs');
var request = require('request');
var JSONStream = require('JSONStream');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = function (file, cb) {
    fs.stat(file, function (err, stat) {
        if (err) return cb(new Sync(0, file))
        
        var since = stat.mtime.valueOf();
        var sync = new Sync(since, file);
        
        fs.readFile(file, 'utf8', function (err, src) {
            if (err) return cb(sync);
            try { sync.packages = JSON.parse(src) }
            catch (err) { return }
            sync.exists = true;
            cb(sync);
        });
    });
};

function Sync (mtime, file) {
    this.packages = [];
    this.file = file;
    this.since = mtime;
    this.exists = false;
}

inherits(Sync, EventEmitter);

Sync.prototype.update = function (filter) {
    var self = this;
    var u = 'http://registry.npmjs.org/-/all/since?startkey=' + self.since;
    var r = request(u);
    
    var parser = JSONStream.parse([ true ]);
    r.pipe(parser);
    
    var index = Object.keys(self.packages)
        .reduce(function (acc, key, ix) {
            acc[key] = ix;
            return acc;
        }, {})
    ;
    
    var offset = 0;
    parser.on('data', function (row) {
        if (!row || typeof row !== 'object') return;
        
        var ix = index[row.name];
        if (ix !== undefined) {
            self.packages.splice(ix + offset, 1);
        }
        if (filter) {
            var res = filter(row);
            if (res) {
                self.packages.unshift(res);
                offset ++;
            }
        }
        else {
            self.packages.unshift(row);
            offset ++;
        }
        
        self.emit('package', row);
    });
    
    parser.on('end', function () {
        self.since = Date.now();
        self.emit('sync');
        
        var src = JSON.stringify(self.packages);
        fs.writeFile(self.file + '_', src, function (err) {
            if (err) return self.emit('error', err)
            
            fs.rename(self.file + '_', self.file, function (err) {
                if (err) self.emit('error', err)
                self.exists = true;
            });
        });
    });
};
