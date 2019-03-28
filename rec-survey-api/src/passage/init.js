const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;
const fs          = require('fs');

function initPassage(app) {
    initDB();
    app.get('/passage-list', (req, res)=>{handleGetPassageList(req, res)});
}

function initDB() {
    fs.readFile('./src/assets/grandfather.txt', 'utf-8', (err, data)=>{
        if(err) {console.log(err);}
        let passage = {
            name: "grandfather",
            text: data
        }
        dbControl.upsertPassageByName(passage);
    });
    fs.readFile('./src/assets/limpy.txt', 'utf-8', (err, data)=>{
        if(err) {console.log(err);}
        let passage = {
            name: "limpy",
            text: data
        }
        dbControl.upsertPassageByName(passage);
    });
    fs.readFile('./src/assets/rainbow.txt', 'utf-8', (err, data)=>{
        if(err) {console.log(err);}
        let passage = {
            name: "rainbow",
            text: data
        }
        dbControl.upsertPassageByName(passage);
    });
}

async function handleGetPassageList(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }
    
    let passageList = await dbControl.getAllPassage().catch(()=>{
        res.sendStatus(400);
        return;
    });

    res.send(JSON.stringify(passageList));
}

module.exports = initPassage;
