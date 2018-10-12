const identity = require('./events/identity.json')


const dictionary = {
    'aws:appsync': true,
    'aws:s3': false,
    'aws:sns': false
}

const argumentsConstructor = (inputArguments) => {
    const argumentsConstructor = []

    for (let key in inputArguments) {
    argumentsConstructor.push({[key]: inputArguments[key]})
    }
    
    const constructedObject = {}
    constructedObject.args = {}
    constructedObject.args['input'] = {}
    
    argumentsConstructor.forEach(element => {
        if (!element.settings)
        Object.assign(constructedObject.args['input'], element)
    })
    
    return constructedObject
}

const identityConstructor = (inputArguments) => {
    if (inputArguments) {
        return identity
    } else {
        return null
    }
}


const CreateEvent = function (inputArguments) {
    if (!dictionary[inputArguments.templateName]) {
        console.log('Template is not available')
        return 'Template is not available'
    } else {
    const customInput = argumentsConstructor(inputArguments.customInput)
    const identityFlag = identityConstructor(inputArguments.cognitoIdentity)
    
    if(customInput && identityFlag) {
        const constructedObject = Object.assign(customInput, identity)  
        return constructedObject
    } else if (!identityFlag) {
        return customInput
    } else {
        return new Error('Something is wrong')
    }
    
    }
} 

module.exports = CreateEvent




