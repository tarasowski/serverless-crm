const AWS = require('aws-sdk')
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
const config = require('../../_config/config.json')


const USER_POOL_ID = process.env.USER_POOL_ID || config.cognitoUserPoolId



module.exports.getCognitoUsers = async(user) => {
    const params = {
            UserPoolId: USER_POOL_ID,
            AttributesToGet: ['email', 'name', 'family_name', 'sub', 'preferred_username'],
            Filter: `preferred_username = "${user.companyId}"`,
            Limit: 0,
            //PaginationToken: 'STRING_VALUE'
            };
    
    
    return cognitoidentityserviceprovider.listUsers(params).promise()
}

module.exports.createUser = (user, payload) => {
    const params = {
            UserPoolId: USER_POOL_ID,
            Username: payload.userEmailForInvitation,
            DesiredDeliveryMediums: ['EMAIL'],
            UserAttributes: [
                {
                Name: 'preferred_username',
                Value: user.companyId
                }
            ]
        }

        return cognitoidentityserviceprovider.adminCreateUser(params).promise()
}

module.exports.assignUserToGroups = (payload, responseFromCognito) => {
    const promises = []
        
        
        Object.keys(payload.accessRights).forEach(key => {
                if (payload.accessRights[key] === 'yes') {
                    const params = {
                            GroupName: key,
                            UserPoolId: USER_POOL_ID,
                            Username: responseFromCognito.User.Username
                    }
                
                    promises.push(cognitoidentityserviceprovider.adminAddUserToGroup(params).promise())
       
                }
            })
            
    return promises
        
}