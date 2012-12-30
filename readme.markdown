# npm-package-sync

synchronize the npm package list to a local file

# example

This program will keep `packages.json` in sync with the package list on
registry.npmjs.org, storing the `name`, `description`, and `keywords` fields.

``` js
var pkgSync = require('npm-package-sync');

pkgSync(__dirname + '/packages.json', function (sync) {
    sync.on('package', function (pkg) {
        console.log(pkg.name);
    });
    
    if (!sync.exists) sync.update(filter)
    setInterval(function () {
        console.log('# ' + Date.now());
        sync.update(filter)
    }, 3 * 1000 * 60);
    
    function filter (pkg) {
        return {
            name: pkg.name,
            description: pkg.description,
            keywords: pkg.keywords
        };
    }
});
```

***

After running sync.js the first time create the initial package list, every 3
minutes it will check to see if there have been any updates using the mtime from
the `package.json` file.

```
$ node example/sync.js 
# 1356856441891
connect-raven
# 1356856621966
# 1356856802059
tweet-blink
^C
```

# methods

``` js
var pkgSync = require('npm-package-sync')
```

## pkgSync(file, cb)

Synchronize `file` with registry.npmjs.org. `cb(sync)` fires with the sync
object after `file` has been read if it exists.

## sync.update(filter)

Synchronize the current packages.json and in-memory cache with the remote
repository. If `filter(pkg)` is given, it should return the object to store in
the synchronized `file`. Otherwise the entire record will be stored.

# attributes

## sync.packages

the array of package data is kept in memory here

## sync.exists

true when `file` exists

# events

## sync.on('package', function (pkg) {})

When a package update is parsed, this event fires with the raw package object
before filtering.

# install

With [npm](https://npmjs.org) do:

```
npm install npm-package-sync
```

# license

MIT
