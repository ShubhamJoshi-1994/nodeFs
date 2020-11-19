var fs = require('fs');
var latestVersion = null;

async function updateCacheIdInConfig() {
    const data = fs.readFileSync('./config.js', 'utf8')
    if (data) {
        let lines = data.split('\n')  // each line in an array
        let matchedLines = lines.filter(line => /cache_version/.test(line))  // find interesting line
        
        matchedLines.map(line => {
            let oldCacheNumber = line.match(/cache_version.+/g);
            let cacheVersionSplit = oldCacheNumber[0].split('-');
            let currentCacheNumber = parseInt(cacheVersionSplit[1])
            cacheVersionSplit[1] = currentCacheNumber + 1;
        
            let newCacheVersion = cacheVersionSplit.join('-');
            latestVersion = newCacheVersion
            
            
            let newLine = data.replace(line.match(/cache_version.+/g), newCacheVersion);
            fs.writeFile('./config.js', newLine, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        })
    }
}

async function updateCacheIdInCustomSw() {
    const data = fs.readFileSync('./customSw.js', 'utf8')
    
    if (data) {
        let lines = data.split('\n')  // each line in an array
        let matchedLines = lines.filter(line => /cache_version/.test(line))  // find interesting line
        
        matchedLines.map(line => {
            let newLine = data.replace(line.match(/cache_version.+/g), latestVersion);
            fs.writeFile('./customSw.js', newLine, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        })
    }
}

updateCacheIdInConfig();
updateCacheIdInCustomSw();