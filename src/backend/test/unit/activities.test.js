const test = require('tape')
const proxyquire = require('proxyquire').noCallThru()
const CreateEvent = require('../../_mocks/aws-mock-generator/index')

test('saveActivity()', async(assert) => {
    assert.plan(1)
    
    const params = {
        templateName: 'aws:appsync',
        cognitoIdentity: true,
        customInput: {
            activityName: 'Call Sergey Brin',
            activityType: 'todo',
            entity: 'activity'
        }
    }
    
    const event = CreateEvent(params)
    
    const dbStub = {
        saveActivity: (user, payload) => {
            return Promise.resolve('Works')
        }
    }
    
    const saveActivity = proxyquire('../../activities/save-activity', {'../_utils/adapters/dynamodb-adapter': dbStub })
    const result = await saveActivity.handler(event)
    assert.equal(result, 'Successfully saved to database', 'should return a message in case of success')
    
})