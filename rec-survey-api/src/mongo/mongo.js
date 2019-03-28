const MongoClient = require('mongodb').MongoClient;
const config      = require('config');
const url         = 'mongodb://' + config.get('MongoDB.host') + ':' + config.get('MongoDB.port');
const dbName      = config.get('MongoDB.dbName');

/**
 *  * Returns collection from db
 *   * by given name to callback
 *    *
 *     * @param string name
 *      * @param function callback
 *       */
function collection(name, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        if(err) {
            console.log(err);
            process.exit(-1);
        }
        let col = client.db(dbName).collection(name);
        console.log(col);
        callback(col);
    });
}

module.exports = collection;
