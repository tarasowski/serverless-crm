const responseConstructor = require('./response-constructor')

module.exports.getContacts = (data) => {
    return data.Items.map(responseConstructor.getContacts)
}

module.exports.getDeals = (data) => {
    return data.Items.map(responseConstructor.getDeals)
}

module.exports.getActivities = (data) => {
    return data.Items.map(responseConstructor.getActivities)
}

module.exports.getCompanies = (data) => {
    return data.Items.map(responseConstructor.getCompanies)
}

module.exports.gotError = (error) => {
    console.log(error)
    console.log(error.stack)
    return error.message
}

module.exports.getCognitoUsers = (data) => {
     return data.Users.map(responseConstructor.getCognitoUsers)
}


module.exports.save = (message, data = false) => {
    if (!data) return `${message}`
    else return `${message}` + data
}
