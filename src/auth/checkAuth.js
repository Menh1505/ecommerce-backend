'use strict'

const findById = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try{
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error',
                status: 'error'
            });
        }
        //check objKey
        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error',
                status: 'error'
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.error(`Error::`, error);
    }
}

const permission = (permission) =>{
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission Denied',
                status: 'error'
            });
        }
        console.log(`Permission::`, req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if(!validPermission){
            return res.status(403).json({
                message: 'Permission Denied',
                status: 'error'
            });
        }
        return next();
    }
}

module.exports = {apiKey, permission};