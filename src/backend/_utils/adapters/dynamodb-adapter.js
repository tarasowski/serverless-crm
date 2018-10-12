const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
const config = require('../../_config/config.json')

const TABLE_NAME = process.env.TABLE_NAME || config.dynamodbTableName
const USER_POOL_ID = process.env.USER_POOL_ID || config.cognitoUserPoolId
const createDate = new Date().toISOString()

module.exports.saveContact = (user, contact) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": contact.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": contact.name
            },
            "entity": {
                "S": contact.entity
            },
            "email": {
                "S": contact.email
            },
            "createDate": {
                "S": createDate
            }
        }
    }

    return dynamodb.putItem(params).promise()
}

module.exports.saveCompany = (user, company) => {

    const params = {
        TableName: TABLE_NAME,
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": company.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": company.name
            },
            "entity": {
                "S": company.entity
            },
            "email": {
                "S": company.email
            },
            "createDate": {
                "S": createDate
            }
        }
    }

    return dynamodb.putItem(params).promise()
}

module.exports.saveDeal = (user, deal) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": deal.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": deal.name
            },
            "entity": {
                "S": deal.entity
            },
            "value": {
                "N": String(deal.value)
            },
            "createDate": {
                "S": createDate
            }
        }
    }
    return dynamodb.putItem(params).promise()
}

module.exports.saveActivity = (user, activity) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": activity.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": activity.name
            },
            "activityType": {
                "S": activity.type
            },
            "entity": {
                "S": activity.entity
            },
            "createDate": {
                "S": createDate
            }
        }
    }
    
    return dynamodb.putItem(params).promise()
}

module.exports.assignActivityToEntity = async(user, payload) => {
    
    // Step 1. fetch all activity details from the database
    
    const fetchActivityDetailsParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :val1 AND entityId = :val2',
        ExpressionAttributeValues: {
            ":val1": {
                "S": user.id
            },
            ":val2": {
                "S": payload.activityEntityId
            }
        }
    }
    
    let fetchEntity
    let fetchCreateDate
    let fetchActivityType
    let fetchCompanyId
    let fetchName
    let fetchEntityId
    
    await dynamodb.query(fetchActivityDetailsParams).promise()
        .then(data => {
            fetchEntity = data.Items[0].entity.S
            fetchActivityType = data.Items[0].activityType.S
            fetchCreateDate = data.Items[0].createDate.S
            fetchCompanyId = data.Items[0].companyId.S
            fetchName = data.Items[0].name.S
            fetchEntityId = data.Items[0].entityId.S
        })
        .catch(err => console.log(err))
    
    // Step 2. assign activity details to an entity in the database

    const activityDetailsParams = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            }
            
        },
        UpdateExpression: "SET #AID = list_append(if_not_exists(#AID, :emptyList), :val1), #ADT = list_append(if_not_exists(#ADT, :emptyList), :val2)",
        ExpressionAttributeNames: {
            "#AID": "activityId",
            "#ADT": "activityDetails"
        },
        ExpressionAttributeValues: {
            ":emptyList": {
              "L": []  
            },
            ":val1": {
                "L":[{"S": payload.activityEntityId}] 
            },
            ":val2": { "L": [{
                "M": {
                    "userId": {
                      "S": user.id
                    },
                    "companyId": {
                        "S": fetchCompanyId
                    },
                    "name": {
                        "S": fetchName
                    },
                    "activityType": {
                        "S": fetchActivityType
                    },
                    "createDate": {
                        "S": fetchCreateDate
                    },
                    "entity": {
                        "S": fetchEntity
                    },
                    "entityId": {
                        "S": fetchEntityId
                    }
                }
            }]
            }
        }
        
    }
    
    return dynamodb.updateItem(activityDetailsParams).promise()
}

module.exports.assignCompanyToEntity = async(user, payload) => {
    
    // Step 1. fetch company details from the database
    
    const fetchCompanyDetailsParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :val1 AND entityId = :val2',
        ExpressionAttributeValues: {
            ":val1": {
                "S": user.id
            },
            ":val2": {
                "S": payload.companyEntityId
            }
        }
    }
    
    let fetchEntity
    let fetchCreateDate
    let fetchEmail
    let fetchCognitoCompanyId
    let fetchName
    let fetchEntityId

    await dynamodb.query(fetchCompanyDetailsParams).promise()
        .then(data => {
            fetchEntity = data.Items[0].entity.S
            fetchEmail = data.Items[0].email.S
            fetchCreateDate = data.Items[0].createDate.S
            fetchCognitoCompanyId = data.Items[0].companyId.S
            fetchName = data.Items[0].name.S
            fetchEntityId = data.Items[0].entityId.S
        })
        .catch(err => console.log(err))
    
    // Step 2. assign activity details to an entity in the database

    const dealDetailsParams = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            }

        },
        UpdateExpression: "SET #ACID = :val1, #ACDT = :val2",
        ExpressionAttributeNames: {
            "#ACID": "associatedCompanyId",
            "#ACDT": "associatedCompanyDetails"
        },
        ExpressionAttributeValues: {
            ":val1": {
                "S": fetchEntityId
            },
            ":val2": {
                "M": {
                    "userId": {
                        "S": user.id
                    },
                    "companyId": {
                        "S": fetchCognitoCompanyId
                    },
                    "name": {
                        "S": fetchName
                    },
                    "email": {
                        "S": fetchEmail
                    },
                    "createDate": {
                        "S": fetchCreateDate
                    },
                    "entity": {
                        "S": fetchEntity
                    },
                    "entityId": {
                        "S": fetchEntityId
                    }
                }
            }
        }

    }
    
    return dynamodb.updateItem(dealDetailsParams).promise()
}

module.exports.assignContactToEntity = async(user, payload) => {
    
    const fetchParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :val1 AND entityId = :val2',
        ExpressionAttributeValues: {
            ":val1": {
                "S": user.id
            },
            ":val2": {
                "S": payload.contactEntityId
            }
        }
    }
    
    let fetchEntity
    let fetchCreateDate
    let fetchCognitoCompanyId
    let fetchName
    let fetchEmail
    let fetchEntityId
    
    await dynamodb.query(fetchParams).promise()
        .then(data => {
            fetchEntity = data.Items[0].entity.S
            fetchCreateDate = data.Items[0].createDate.S
            fetchCognitoCompanyId = data.Items[0].companyId.S
            fetchName = data.Items[0].name.S
            fetchEmail = data.Items[0].email.S
            fetchEntityId = data.Items[0].entityId.S
        })
        .catch(err => console.log(err))
        

    const params = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            }
            
        },
        UpdateExpression: "SET #CID = list_append(if_not_exists(#CID, :emptyList), :val1), #CDT = list_append(if_not_exists(#CDT, :emptyList), :val2)",
        ExpressionAttributeNames: {
            "#CID": "contactId",
            "#CDT": "contactDetails"
        },
        ExpressionAttributeValues: {
            ":emptyList": {
                "L": []
            },
            ":val1": {
                "L": [{"S": payload.contactEntityId}]
            },
            ":val2": {
                "L": [{
                "M": {
                    "userId": {
                      "S": user.id
                    },
                    "companyId": {
                        "S": fetchCognitoCompanyId
                    },
                    "createDate": {
                        "S": fetchCreateDate
                    },
                    "name": {
                        "S": fetchName
                    },
                    "entityId": {
                        "S": fetchEntityId
                    },
                    "entity": {
                        "S": fetchEntity
                    },
                    "email": {
                        "S": fetchEmail
                    }
                }
            }]
            }
        }
        
    }
    
    return dynamodb.updateItem(params).promise()
}

module.exports.assignDealToEntity = async(user, payload) => {
     const fetchParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :val1 AND entityId = :val2',
        ExpressionAttributeValues: {
            ":val1": {
                "S": user.id
            },
            ":val2": {
                "S": payload.dealEntityId
            }
        }
    }
    
    let fetchEntity
    let fetchValue
    let fetchCreateDate
    let fetchCognitoCompanyId
    let fetchName
    let fetchEntityId
    
    await dynamodb.query(fetchParams).promise()
        .then(data => {
            fetchEntity = data.Items[0].entity.S
            fetchValue = data.Items[0].value.N
            fetchCreateDate = data.Items[0].createDate.S
            fetchCognitoCompanyId = data.Items[0].companyId.S
            fetchName = data.Items[0].name.S
            fetchEntityId = data.Items[0].entityId.S
        })
        .catch(err => console.log(err))
        
    const params = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            }
            
        },
        UpdateExpression: "SET #DID = list_append(if_not_exists(#DID, :emptyList), :val1), #DDT = list_append(if_not_exists(#DDT, :emptyList), :val2)",
        ExpressionAttributeNames: {
            "#DID": "dealId",
            "#DDT": "dealDetails"
        },
        ExpressionAttributeValues: {
            ":emptyList": {
                "L": []
            },
            ":val1": {
                "L":  [{"S": payload.dealEntityId}]
            },
            ":val2": { "L": [{
                "M": {
                    "userId": {
                      "S": user.id
                    },
                    "companyId": {
                        "S": fetchCognitoCompanyId
                    },
                    "value": {
                        "S": fetchValue
                    },
                    "createDate": {
                        "S": fetchCreateDate
                    },
                    "name": {
                        "S": fetchName
                    },
                    "entityId": {
                        "S": fetchEntityId
                    },
                    "entity": {
                        "S": fetchEntity
                    }
                }
            }]
            }
        }
        
    }
    
    return dynamodb.updateItem(params).promise()
        
}

module.exports.assignOwnerToEntity = async(user, payload) => {
    const cognitoParams = {
            UserPoolId: USER_POOL_ID,
            AttributesToGet: ['email', 'name', 'family_name', 'sub', 'preferred_username'],
            Filter: `sub = "${payload.ownerId}"`,
            Limit: 0,
            //PaginationToken: 'STRING_VALUE'
            }
    
    
    const userDetails = await cognitoidentityserviceprovider.listUsers(cognitoParams).promise()
    .then(data => {

        return data.Users.map(element => {
            return {
                userId: element.Attributes[0].Value,
                firstName: element.Attributes[1].Value,
                lastName: element.Attributes[3].Value,
                companyId: element.Attributes[2].Value,
                email: element.Attributes[4].Value
            }
        })
    })
    .catch(err => console.log(err))
    
    const params = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            }
            
        },
        UpdateExpression: "SET #OID = :val1, #ODT = :val2",
        ExpressionAttributeNames: {
            "#OID": "ownerId",
            "#ODT": "ownerDetails"
        },
        ExpressionAttributeValues: {
            ":val1": {
                "S": userDetails[0].userId
            },
            ":val2": {
                "M": {
                    "userId": {
                      "S": userDetails[0].userId
                    },
                    "companyId": {
                        "S": userDetails[0].companyId
                    },
                    "firstName": {
                        "S": userDetails[0].firstName
                    },
                    "lastName": {
                        "S": userDetails[0].lastName
                    },
                    "email": {
                        "S": userDetails[0].email
                    }
                }
            }
        }
        
    }
    
    return dynamodb.updateItem(params).promise()
}

module.exports.saveActivityFromEntity = async(user, payload) => {
    const params = {
        TableName: TABLE_NAME,
        ReturnConsumedCapacity: "TOTAL",
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": payload.activityName
            },
            "activityType": {
                "S": payload.activityType
            },
            "entity": {
                "S": payload.entity
            },
            "createDate": {
                "S": createDate
            }
        }
    }
    
    await dynamodb.putItem(params).promise()
        .then(() => console.log('activity saved to database'))
        .catch(err => console.log(err))
    
    const updateParams = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.assignToEntityId
            }
            
        },
        UpdateExpression: "SET #AID = list_append(if_not_exists(#AID, :emptyList), :val1), #ADT = list_append(if_not_exists(#ADT, :emptyList), :val2)",
        ExpressionAttributeNames: {
            "#AID": "activityId",
            "#ADT": "activityDetails"
        },
        ExpressionAttributeValues: {
            ":emptyList": {
              "L": []  
            },
            ":val1": {
                "L": [ {"S": payload.entityId} ]
            },
            ":val2": {
                "L": [
                   { "M": {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": payload.activityName
            },
            "activityType": {
                "S": payload.activityType
            },
            "entity": {
                "S": payload.entity
            },
            "createDate": {
                "S": createDate
            }
                    
        }
        }]
            }
        }
        
    }
    
    return dynamodb.updateItem(updateParams).promise()

}

module.exports.saveDealFromEntity = async(user, payload) => {
    
    const params = {
        TableName: TABLE_NAME,
        ReturnConsumedCapacity: "TOTAL",
        Item: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": payload.dealName
            },
            "entity": {
                "S": payload.entity
            },
            "value": {
                "N": payload.dealValue
            },
            "createDate": {
                "S": createDate
            }
        }
    }
    
    await dynamodb.putItem(params).promise()
        .then(() => `Saved successfully to your database`)
        .catch(err => console.log(err))
    
   
  
    const updateParams = {
        TableName: TABLE_NAME,
        Key: {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.assignToEntityId
            }
            
        },
        UpdateExpression: "SET #DID = list_append(if_not_exists(#DID, :emptyList), :val1), #DDT = list_append(if_not_exists(#DDT, :emptyList), :val2)",
        ExpressionAttributeNames: {
            "#DID": "dealId",
            "#DDT": "dealDetails"
        },
        ExpressionAttributeValues: {
            ":emptyList": {
              "L": []  
            },
            ":val1": {
                "L": [ {"S": payload.entityId} ]
            },
            ":val2": {
                "L": [
                   { "M": {
            "userId": {
                "S": user.id
            },
            "entityId": {
                "S": payload.entityId
            },
            "companyId": {
                "S": user.companyId
            },
            "name": {
                "S": payload.dealName
            },
            "value": {
                "N": payload.dealValue
            },
            "entity": {
                "S": payload.entity
            },
            "createDate": {
                "S": createDate
            }
                    
        }
        }]
            }
        }
        
    }
    return dynamodb.updateItem(updateParams).promise()
            
}

module.exports.getContacts = (user, payload) => {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ":v1": {
                "S": user.id
            },
            ":v2": {
                "S": payload.entity
            }
        },
        KeyConditionExpression: "userId = :v1 AND begins_with ( entityId, :v2 ) ",
        //ReturnConsumedCapacity: "TOTAL"
    }
    
    return dynamodb.query(params).promise()
}

module.exports.getDeals = async(user, payload) => {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ":v1": {
                "S": user.id
            },
            ":v2": {
                "S": payload.entity
            }
        },
        KeyConditionExpression: "userId = :v1 AND begins_with ( entityId, :v2 ) ",
        ReturnConsumedCapacity: "TOTAL"
    }
    return dynamodb.query(params).promise()
}

module.exports.getActivities = async(user, payload) => {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ":v1": {
                "S": user.id
            },
            ":v2": {
                "S": payload.entity
            }
        },
        KeyConditionExpression: "userId = :v1 AND begins_with ( entityId, :v2 ) ",
        ReturnConsumedCapacity: "TOTAL"
    }
    
    return dynamodb.query(params).promise()
}

module.exports.getCompanies = async(user, payload) => {
    const params = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
            ":v1": {
                "S": user.id
            },
            ":v2": {
                "S": payload.entity
            }
        },
        KeyConditionExpression: "userId = :v1 AND begins_with ( entityId, :v2 ) ",
        ReturnConsumedCapacity: "TOTAL"
    }
    
    return dynamodb.query(params).promise()
}

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