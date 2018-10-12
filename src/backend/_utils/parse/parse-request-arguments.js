const uuidv4 = require('uuid/v4')

module.exports.saveContact = (event) => {
    const input = event.args['input']
    const entity = input.entity
    const entityId = input.entity + '_' + uuidv4()
    const name = input.contactName
    const email = input.contactEmail

    return {
        entity,
        entityId,
        name,
        email
    }

}

module.exports.saveCompany = (event) => {
    const input = event.args['input']
    const entity = input.entity
    const entityId = input.entity + '_' + uuidv4()
    const name = input.companyName
    const email = input.companyEmail

    return {
        entity,
        entityId,
        name,
        email
    }

}

module.exports.saveDeal = (event) => {
    const input = event.args['input']
    const entity = input.entity
    const entityId = input.entity + '_' + uuidv4()
    const name = input.dealName
    const value = input.dealValue

    return {
        entity,
        entityId,
        name,
        value
    }

}

module.exports.saveActivity = (event) => {
    const input = event.args['input']
    const entity = input.entity
    const entityId = input.entity + '_' + uuidv4()
    const name = input.activityName
    const type = input.activityType

    return {
        entity,
        entityId,
        name,
        type
    }

}

module.exports.assignActivityToEntity = (event) => {
    const entityId = event.args.entityId
    const activityEntityId = event.args.activityEntityId
    
    return {
        entityId,
        activityEntityId
    }
}

module.exports.assignCompanyToEntity = (event) => {
    const entityId = event.args.entityId
    const companyEntityId = event.args.companyEntityId
    
    return {
        entityId,
        companyEntityId
    }
}

module.exports.assignContactToEntity = (event) => {
    const entityId = event.args.entityId
    const contactEntityId = event.args.contactEntityId
    
    return {
        entityId,
        contactEntityId
    }
}

module.exports.assignDealToEntity = (event) => {
    const entityId = event.args.entityId
    const dealEntityId = event.args.dealEntityId
    
    return {
        entityId,
        dealEntityId
    }
}

module.exports.assignOwnerToEntity = (event) => {
    const entityId = event.args.entityId
    const ownerId = event.args.ownerUserId
    
    return {
        entityId,
        ownerId
    }
}

module.exports.saveActivityFromEntity = (event) => {
    const activityName = event.args['input'].activityName
    const activityType = event.args['input'].activityType
    const entity = event.args['input'].entity
    const assignToEntityId = event.args['input'].assignToEntityId
    const entityId = entity + '_' + uuidv4()
    
    return {
        activityName,
        activityType,
        entity,
        assignToEntityId,
        entityId
    }
}

module.exports.saveDealFromEntity = (event) => {
    const entity = event.args['input'].entity
    const assignToEntityId = event.args['input'].assignToEntityId
    const dealName = event.args['input'].dealName
    const dealValue = event.args['input'].dealValue.toString()
    const entityId = entity + '_' + uuidv4()
    
    return {
        entity,
        assignToEntityId,
        dealName,
        dealValue,
        entityId
    }
}

module.exports.get = (event) => {
    const entity = event.args.entity
    return {
        entity
    }
}

module.exports.inviteUser = (event) => {
    
    const userEmailForInvitation = event.args.userEmail
    const input = event.args['input']
    const canViewEverything = input.canViewEverything
	const canViewOwnerOnly = input.canEditOwnerOnly
	const canEditEverything = input.canEditEverything
	const canEditOwnerOnly = input.canEditOwnerOnly
	const canExport = input.canExport
	const canImport = input.canImport
	const canInvite = input.canInvite
	const hasFullAccess = input.hasFullAccess

    return {
        userEmailForInvitation,
        accessRights: {canViewEverything,
        canViewOwnerOnly,
        canEditEverything,
        canEditOwnerOnly,
        canExport,
        canImport,
        canInvite,
        hasFullAccess}
    }
}