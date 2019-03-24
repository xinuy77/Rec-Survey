const dbControl   = require('../mongo').Controller;
const nullChecker = require('../commons').NullChecker;
const crypto      = require('crypto');

function initSurvey(app) {
    app.get('/survey', (req, res)=>{handleGetSurvey(req, res)});
    app.post('/survey', (req, res)=>{handlePostSurvey(req, res)});
    app.delete('/survey/:s_id', (req, res)=>{handleDeleteSurvey(req, res)});
    app.get('/survey-list', (req, res)=>{handleGetSurveyList(req, res)});
    app.post('/result', (req, res)=>{handlePostResult(req, res)});
    app.post('/assign', (req, res)=>{handleAssignSurvey(req, res)});
    app.post('/unassign', (req, res)=>{handleUnAssignSurvey(req, res)});
}

async function handleDeleteSurvey(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
        return;
    }
    if(!req.params.s_id) {
        res.sendstatus(400);
        return;
    }
    let s_id = req.params.s_id;
    
    try {
        await dbControl.deleteSurvey(s_id);
        await dbControl.bulkDisableAssigned(s_id);
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
}

function handleUnAssignSurvey(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400); 
        return;
    } 
    let userAssigned = {
        _id: req.body._id,
        index: req.body.index
    };

    if(nullChecker.hasNull(userAssigned)) {
        res.sendStatus(400);
        return;
    }

    dbControl.disableAssignedSurvey(userAssigned).then(()=>{
        res.sendStatus(200);
    }).catch(()=>{
        res.sendStatus(400);
    });
}

function handlePostSurvey(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
    }
    let survey = {
        picture_id: req.body.picture_id,
        passage_id: req.body.passage_id,
        name: req.body.name
    }

    if(nullChecker.hasNull(survey)) {
        res.sendStatus(400);
        return;
    }

    dbControl.insertSurvey(survey).then(()=>{
        res.sendStatus(200);
    }).catch(()=>{
        res.sendStatus(400);
    });
}

async function handleGetSurveyList(req, res) {
    if(!req.session.isAdmin) {
        res.sendStatus(400);
    }

    let surveyList = await dbControl.getAllSurvey().catch(()=>{
        res.sendStatus(400);
        return;
    });

    res.send(JSON.stringify(surveyList));
}

function handleAssignSurvey(req, res) {
    //TODO ONLY ADMIN USER

    let u_id           = req.body.u_id;
    let cur_date       = (new Date()).valueOf().toString();
    let rand           = Math.random().toString();
    let assignedSurvey = {
        s_id:     req.body.s_id,
        maxTry:   req.body.maxTry,
        tryCount: 0,
        surveyResult: [],
        completed: false,
        disabled: false,
        name: req.body.name,
        identifier: crypto.createHash('sha1').update(cur_date + rand).digest('hex')
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
        s_id: req.body.s_id,
        result: req.body.surveyResult                //TODO add important values later
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
        let identifier = req.body.identifier;

        for(let i = 0; i < result.assignedSurvey.length; i++) {
            let assignedSurvey = result.assignedSurvey[i];

            if(assignedSurvey.identifier != identifier) {
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
            result.assignedSurvey[i].surveyResult.push(s_result.result);
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
        let identifier;

        for(let survey of assignedSurvey) {
            if(!survey.completed && !survey.disabled) {
                s_id       = survey.s_id;
                identifier = survey.identifier;
                break;
            }
        }
        
        if(!s_id) {
            res.sendStatus(400);
            return;
        }

        dbControl.getSurveyById(s_id, (result, err)=>{
            if(!result || err) {
                res.sendStatus(400);
                return;
            }

            result[0].identifier = identifier;
            res.send(JSON.stringify(result));
        });    
    });
}

module.exports = initSurvey;

