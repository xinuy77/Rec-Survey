const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;

function initPicture(app) {
    app.get('/picture-list', (req, res)=>{handleGetPictureList(req, res)});
}

async function handleGetPictureList(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }
    
    let pictureList = await dbControl.getAllPicture().catch(()=>{
        res.sendStatus(400);
        return;
    });

    res.send(JSON.stringify(pictureList));
}

module.exports = initPicture;
