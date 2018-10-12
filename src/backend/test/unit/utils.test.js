const test = require('tape')
const proxyquire = require('proxyquire').noCallThru()
const CreateEvent = require('../../_mocks/aws-mock-generator/index')
const parseUserIdentity = require('../../_utils/parse/parse-user-identity')
const parseRequestArguments = require('../../_utils/parse/parse-request-arguments')

test('parseUserIdentity() with an event object', (assert) => {
    assert.plan(1)
    
    const params = {
        templateName: 'aws:appsync',
        cognitoIdentity: true,
        customInput: {
            contactName: 'Dimitri Tarasowski',
            contactEmail: 'dimitri@tarasowski.de',
            entity: 'contact'
        }
    }
    
    const event = CreateEvent(params)
    
    
    assert.deepEqual(Object.keys(parseUserIdentity(event)).length, 3, 'function should return an object with exactly 3 properties')
})

test('parseUserIdentity() lookup property names', (assert) => {
     assert.plan(3)
       
       const params = {
        templateName: 'aws:appsync',
        cognitoIdentity: true,
        customInput: {
            contactName: 'Dimitri Tarasowski',
            contactEmail: 'dimitri@tarasowski.de',
            entity: 'contact'
            }
        }
    
        const event = CreateEvent(params)
        
        const user = parseUserIdentity(event)
        const objMustHaveProperties = ['id', 'companyId', 'groups']
        objMustHaveProperties.forEach(element => {
            if (user[element]) {
            assert.ok(true, `property ${element.toUpperCase()} is on the user object available`)    
                } else {
            assert.ok(false, `something is wrong with: ${element.toUpperCase()} property on the user object`)
            }
        
    })
})

test('parseUserIdentity() with a missing event object', (assert) => {
    assert.plan(1)
    
    const parseUserIdentity = require('../../_utils/parse/parse-user-identity')
    const user = parseUserIdentity()
    assert.deepEqual(user, [], 'should return an empty array if no event object provided')
    
})

test('parseRequestArguments.saveContact() with an event object', (assert) => {
    assert.plan(1)

    const params = {
        templateName: 'aws:appsync',
        cognitoIdentity: true,
        customInput: {
            contactName: 'Dimitri Tarasowski',
            contactEmail: 'dimitri@tarasowski.de',
            entity: 'contact'
        }
    }
    
    const event = CreateEvent(params)
    
    assert.deepEqual(Object.keys(parseRequestArguments.saveContact(event)).length, 4, 'should return an object with exactly 4 properties')
})

test('parseRequestArguments().inviteUsers', (assert) => {
    
    //assert.deepEqual(Object.keys(parseRequestArguments.inviteUser(payload)).length, 1, 'function should return an object with exactly 1 properties')
    assert.end()
})