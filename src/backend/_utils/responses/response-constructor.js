
const transformList = (entry) => {
    if(entry !== undefined && Object.keys(entry).length !== 0 && entry.constructor === Object) {
        const list = entry.L.map(element => element.S)
        return list
    }
    return []
}

const transformString = (entry) => {
    
    if(entry !== undefined && Object.keys(entry).length !== 0 && entry.constructor === Object) {
        const string = entry.S
        return string
    }
    return ''
}

const transformMap = (entry) => {
    if(entry !== undefined && Object.keys(entry).length !== 0 && entry.constructor === Object) {
        
        const details = entry.M 
        const transformedMap = {}
        
        Object.keys(details).forEach(key => {
            transformedMap[key] = details[key].S
        })
         
        return transformedMap
    }
    return {}
}

const transformListMap = (entry) => {
    if(entry !== undefined && Object.keys(entry).length !== 0 && entry.constructor === Object) {
        
        const list = entry.L
        
        return list.map(element => {
            const details = element.M
            const transformedMap = {}
            
            Object.keys(details).forEach(key => {
                transformedMap[key] = details[key].S
            })
            return transformedMap
            
        })
        
    
        
    }
    
    return []
}

module.exports.getContacts = (element) => {
        if (element) {
            return {
                    userId: element.userId.S,
                    entityId: element.entityId.S,
                    companyId: element.companyId.S,
                    name: element.name.S,
                    email: element.email.S,
                    entity: element.entity.S,
                    createDate: element.createDate.S,
                    ownerId: transformString(element.ownerId),
                    ownerDetails: transformMap(element.ownerDetails),
                    dealId: transformList(element.dealId),
                    dealDetails: transformListMap(element.dealDetails),
                    activityId: transformList(element.activityId),
                    activityDetails: transformListMap(element.activityDetails),
                    associatedCompanyId: transformString(element.associatedCompanyId),
                    associatedCompanyDetails: transformMap(element.associatedCompanyDetails),
                }    
        }

        return []
}

module.exports.getActivities = (element) => {
    if (element) {
        return {
                    userId: element.userId.S,
                    entityId: element.entityId.S,
                    companyId: element.companyId.S,
                    name: element.name.S,
                    entity: element.entity.S,
                    createDate: element.createDate.S,
                    activityType: element.activityType.S
                }
    }
    
    return {}
}

module.exports.getDeals = (element) => {
    if (element) {
        return {
                    userId: element.userId.S,
                    entityId: element.entityId.S,
                    companyId: element.companyId.S,
                    name: element.name.S,
                    value: element.value.N,
                    entity: element.entity.S,
                    createDate: element.createDate.S
                    
                }    
    }
    
    return {}
}

module.exports.getCompanies = (element) => {
    if (element) {
        return {
                    userId: element.userId.S,
                    entityId: element.entityId.S,
                    companyId: element.companyId.S,
                    name: element.name.S,
                    email: element.email.S,
                    entity: element.entity.S,
                    createDate: element.createDate.S
                    
                }
    }
    
    return {}
}

module.exports.getCognitoUsers = (element) => {
    if (element) {
        // checkout the index positions - code smell
            return {
                userId: element.Attributes[0].Value,
                firstName: element.Attributes[1].Value,
                lastName: element.Attributes[3].Value,
                companyId: element.Attributes[2].Value,
                email: element.Attributes[4].Value
            }
    }
    return {}
}