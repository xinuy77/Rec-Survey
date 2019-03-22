const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;

function initPassage(app) {
    app.get('/passage-list', (req, res)=>{handleGetPassageList(req, res)});
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
