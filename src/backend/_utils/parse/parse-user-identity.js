module.exports = (event) => {

    const identity = event.identity.claims
    const id = identity.sub
    const companyId = identity.preferred_username
    const groups = event.groups || 'user is not assiged to a group'
    
    return {
        id,
        companyId,
        groups
    }
}
