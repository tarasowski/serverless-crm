const parseUserIdentity = require('../_utils/parse/parse-user-identity')
const parseRequestArguments = require('../_utils/parse/parse-request-arguments').inviteUser
const cognito = require('../_utils/adapters/cognito-adapter')
const sendMetric = require('../_utils/tracker/invocation-tracker')
const processResponse = require('../_utils/responses/process-response')


exports.handler = async (event) => {
    try {
        const user = parseUserIdentity(event)
        const payload = parseRequestArguments(event)
        
        sendMetric(user.id, user.companyId, 'lambda', 'claudiacrm')

        const responseFromCognito = await cognito.createUser(user, payload)
        const promises = cognito.assignUserToGroups(payload, responseFromCognito)
        await Promise.all(promises)
        
        return processResponse.save('Congratulations! Invitation was successfully sent')
        
    } catch (error) {
    
        return processResponse.gotError(error)
    }
    
    
    
}
