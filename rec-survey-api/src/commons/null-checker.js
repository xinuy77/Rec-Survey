function hasNull(object) {
    for(let prop in object) {
        if(object[prop] == null) {
            return true;
        }
    }
    return false;
}

module.exports = {
    hasNull: hasNull
};
