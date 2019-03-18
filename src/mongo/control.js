const collection = require('./mongo');
let   ObjectId   = require('mongodb').ObjectID;

function getUserIdByCredential(credential, callback) {
    findOneFromUserCollection(credential, (res, err)=>{
        callback(res, err);
    });
}

function getUserByUsername(username, callback) {
    let user = {
        username: username
    };

    findOneFromUserCollection(user, (res, err)=>{
        callback(res, err);
    });
}

function getUserById(u_id, callback) {
    let user = {
         _id: new ObjectId(u_id)
    };
    console.log(user);
    findOneFromUserCollection(user, (res, err)=>{
        callback(res, err);
    });

}

function addNewUser(user, callback) {
    insertToUserCollection(user, (res, err)=>{
        callback(res, err);
    });
}

function insertToUserCollection(data, callback) {
    collection('user', (db)=>{
        db.insertOne(data, (err, res)=>{
            callback(res, err);
        });
    });
}

function findOneFromUserCollection(data, callback) {
    collection('user', (db)=>{
        db.findOne(data, (err, res)=>{
            if(err) {
                console.log("error");
                console.log(err);
                callback(res, err);
            }
            else {
                callback(res, err);
            }
        });
    });
}

function getSurveyById(s_id, callback) {
    let data = {
        _id: new ObjectId(s_id)
    };
    let lookupPicture = {
        from: "picture",
        localField: "picture_id",
        foreignField: "_id",
        as: "pic"
    };
    let lookupPassage = {
        from: "passage",
        localField: "passage_id",
        foreignField: "_id",
        as: "pas"
    };

    collection('survey', (db)=>{
        db.aggregate([
            {
                $lookup: lookupPicture
            },
            {$unwind: "$pic"},
            {
                $lookup: lookupPassage
            },
            {$unwind: "$pas"},
            {
                $match: {
                    $and: [data]
                }
            }
        ]).toArray((err,res)=>{
            console.log("returning joined result");
            console.log(res);
            callback(res, err);
        });
    });
}

function updateUser(data, callback) {
    collection('user', (db)=>{
        let query   = {_id: new ObjectId(data._id)};
        delete data._id;
        let newdata = {$set: data};
        
        db.updateOne(query, newdata, (err, res)=>{
            callback(res, err);
        });
    });
}

function pushToUser(u_id, data, callback) {
    collection('user', (db)=>{
        let newdata = {$push: data};
        let query   = {_id: new ObjectId(u_id)};

        db.updateOne(query, newdata, (err, res)=>{
            callback(res, err);
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject)=>{
        collection('user', (db)=>{
            db.find({}).toArray((err, result)=>{
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

function getAllSurvey() {
    return new Promise((resolve, reject)=>{
        collection('survey',(db)=>{
            db.find({}).toArray((err, result)=>{
                if(err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    });
}

function insertSurvey(survey) {
    survey.picture_id = new ObjectId(survey.picture_id);
    survey.passage_id = new ObjectId(survey.passage_id);

    return new Promise((resolve, reject)=>{
        collection('survey', (db)=>{
            db.insertOne(survey, (err, res)=>{
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
}

function updateAssignedSurvey(userAssigned, assignedSurvey) {
    let query = {
        _id: new ObjectId(userAssigned._id),
        "assignedSurvey.s_id": new ObjectId(userAssigned.s_id)
    };
    let update = {
        $set: assignedSurvey
    };

    return new Promise((resolve, reject)=>{
        collection('user', (db)=>{
            db.updateOne(query, update, (err, res)=>{
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
}

function disableAssignedSurvey(userAssigned) {
    let query = {
        _id: new ObjectId(userAssigned._id)
    };
    let surveyProp = "assignedSurvey."+userAssigned.index+".disabled";
    let unAssignSurvey = {
        $set: {[surveyProp]: true}
    };

    return new Promise((resolve, reject)=>{
        collection('user', (db)=>{
            db.updateOne(query, unAssignSurvey, (err, res)=>{
                if(err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    });
}

module.exports = {
    getUserIdByCredential: getUserIdByCredential,
    getUserById:           getUserById,
    addNewUser:            addNewUser,
    getUserByUsername:     getUserByUsername,
    getSurveyById:         getSurveyById,
    updateUser:            updateUser,
    pushToUser:            pushToUser,
    getAllUsers:           getAllUsers,
    getAllSurvey:          getAllSurvey,
    insertSurvey:          insertSurvey,
    updateAssignedSurvey:  updateAssignedSurvey,
    disableAssignedSurvey: disableAssignedSurvey
};
