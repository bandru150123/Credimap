const fs = require('fs');
process.on('uncaughtException', e => {
    fs.writeFileSync('err.txt', e.stack || e.toString());
    process.exit(1);
});
process.on('unhandledRejection', e => {
    fs.writeFileSync('err.txt', e.stack || e.toString());
    process.exit(1);
});
require('./index.js');
