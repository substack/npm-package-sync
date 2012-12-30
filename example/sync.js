var pkgSync = require('../');

pkgSync(__dirname + '/packages.json', function (sync) {
    sync.on('package', function (pkg) {
        console.log(pkg.name);
    });
    
    if (!sync.exists) sync.update(filter)
    setInterval(sync.update.bind(sync, filter), 3 * 1000 * 60);
    
    function filter (pkg) {
        return {
            name: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords
        };
    }
});
