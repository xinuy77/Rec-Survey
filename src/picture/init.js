const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;

function initPicture(app) {
    initDB();
    app.get('/picture-list', (req, res)=>{handleGetPictureList(req, res)});
}

function initDB() {
    let cookieTheft = {
        name: "cookie theft",
        path: "cookietheft.jpg"
    }
    let coffeeCar = {
        name: "coffee car",
        path: "coffeecar.jpg"
    }
    let swingChild = {
        name: "swing child",
        path: "swingchild.jpg"
    }
    let picnic = {
        name: "picnic",
        path: "picnic.jpg"
    }
    let twoChild = {
        name: "two child",
        path: "twochild.jpg"
    }
    dbControl.upsertPictureByName(cookieTheft);
    dbControl.upsertPictureByName(coffeeCar);
    dbControl.upsertPictureByName(swingChild);
    dbControl.upsertPictureByName(picnic);
    dbControl.upsertPictureByName(twoChild);
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
