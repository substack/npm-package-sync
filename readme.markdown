# npm-package-sync

keep an in-memory copy of the npm package list in sync

# example

``` js
var pkgSync = require('npm-package-sync');

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
