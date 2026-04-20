const fs = require('fs');
try {
    require('./index.js');
} catch (e) {
    fs.writeFileSync('err.txt', e.stack || typeof e === 'string' ? e : JSON.stringify(e));
}
