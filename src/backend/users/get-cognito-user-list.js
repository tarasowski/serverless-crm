const parseUserIdentity = require('../_utils/parse/parse-user-identity')
const sendMetric = require('../_utils/tracker/invocation-tracker')
const cognito = require('../_utils/adapters/cognito-adapter')
const processResponse = require('../_utils/responses/process-response')

exports.handler = async (event) => {
    const user = parseUserIdentity(event)
    
    sendMetric(user.id, user.companyId, 'lambda', 'claudiacrm')
    
    return cognito.getCognitoUsers(user)
        .then(data => processResponse.getCognitoUsers(data))
        .catch(err => processResponse.gotError(err))
}
