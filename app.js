const app   = require('./src').app;
const fs    = require('fs');
const https = require('https');
const port  = 2000;

let options =
{
  key:  fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
};

let server = https.createServer(options, app).listen(2000, ()=>{
    console.log('Listening on port ' + port + '!');
})

require('./src').initWebsocket(server);
