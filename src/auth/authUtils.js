'use strict'

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, PublicKeyCredential, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        JWT.verify(accessToken, PublicKeyCredential, (err, decoded) => {
            if(err){
                console.error(`Error verify::`, err);
            }else {
                console.log(`Decoded verify::`, decoded);
            }
        });
        return {
            accessToken,
            refreshToken
        } 
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createTokenPair
}