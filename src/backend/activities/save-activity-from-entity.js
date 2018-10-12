const parseUserIdentity = require('../_utils/parse/parse-user-identity')
const parseRequestArguments = require('../_utils/parse/parse-request-arguments').saveActivityFromEntity
const db = require('../_utils/adapters/dynamodb-adapter')
const sendMetric = require('../_utils/tracker/invocation-tracker')
const processResponse = require('../_utils/responses/process-response')


exports.handler = async (event) => {
    const user = parseUserIdentity(event)
    const payload = parseRequestArguments(event)

    sendMetric(user.id, user.companyId, 'lambda', 'claudiacrm')
    
    return db.saveActivityFromEntity(user, payload)
        .then(data => processResponse.save('Successfully saved to db', data))
        .catch(err => processResponse.gotError('Something went wrong', err))
    
}
