const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;

function initSurvey(app) {
    app.get('/survey', (req, res)=>{handleGetSurvey(req, res)});
    app.post('/result', (req, res)=>{handlePostResult(req, res)});
    app.post('/assign', (req, res)=>{handleAssignSurvey(req, res)});
}

function handleAssignSurvey(req, res) {
    
    //TODO ONLY ADMIN USER
    if(!req.body.u_id) {
        res.sendStatus(400);
        return;
    }
 
    let u_id           = req.body.u_id;
    let assignedSurvey = {
        s_id:     req.body.s_id,
        maxTry:   req.body.maxTry,
        tryCount: 0
    };

    if(nullChecker.hasNull(assignedSurvey)) {
        res.sendStatus(400);
        return;
    }
    let data = {assignedSurvey: assignedSurvey};

    dbControl.pushToUser(u_id, data, (result, err)=>{
        if(err) {
            res.sendStatus(400);
            return;
        }
        res.sendStatus(200);
    });
}

function handlePostResult(req, res) {
    if(!req.session.user) {
        res.sendStatus(400);
        return;
    }

    let u_id     = req.session.user;
    let s_result = {
        s_id: req.body.s_id
                             //TODO add important values later
    };

    if(nullChecker.hasNull(s_result)) {
        res.sendStatus(400);
        return;
    }

    dbControl.getUserById(u_id, (result, err)=>{
        if(err) {
            res.sendStatus(400);
            return;
        }
        let s_id = req.body.s_id;
        console.log("printing result");
        console.log(result);
        
        for(let i = 0; i < result.assignedSurvey.length; i++) {
            let assignedSurvey = result.assignedSurvey[i];

            if(assignedSurvey.s_id != s_id) {
                continue;
            }
            if(result.assignedSurvey[i].completed) {
                res.sendStatus(400);
                return;
            }
            if(assignedSurvey.tryCount < assignedSurvey.maxTry) {
                result.assignedSurvey[i].tryCount++;
                if(assignedSurvey.tryCount == assignedSurvey.maxTry) {
                    result.assignedSurvey[i].completed = true;
                }
            }
            break;
        }

        dbControl.updateUser(result, (result, err)=>{
            if(err) {
                res.sendStatus(400);
                return;            
            }
            res.sendStatus(200);
        });
    });
}

function handleGetSurvey(req, res) {
    if(!req.session.user) {
        res.sendStatus(400);
        return;
    }
    let u_id = req.session.user;
    
    dbControl.getUserById(u_id, (result, err)=> {
        if(err) {
            res.sendStatus(400);
            return;
        }
        
        let assignedSurvey = result.assignedSurvey;

        if(!assignedSurvey) {
            res.sendStatus(400);
            return;
        }

        let s_id;

        for(let survey of assignedSurvey) {
            if(!survey.completed) {
                s_id = survey.s_id;
                break;
            }
        }
        console.log("looking for" + s_id);
        dbControl.getSurveyById(s_id, (result, err)=>{
            if(!result || err) {
                res.sendStatus(400);
                return;
            }
            res.send(JSON.stringify(result));
        });    
    });
}

module.exports = initSurvey;

