'use strict'

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '1h'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '1d'
        });

        JWT.verify(accessToken, publicKey, (err, decoded) => {
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