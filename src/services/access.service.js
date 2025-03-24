'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { log } = require('console');
const { getInfoData } = require('../utils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({name, email, password}) => {
    try{
        //step 1: check email exists??
        const holderShop = await shopModel.findOne({email}).lean();

        if(holderShop){
            return {
                code: 'xxxx',
                message: 'Email already exists',
                status: 'error'
            }
        }

        const passwordHash = await bcrypt.hashSync(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        });

        console.log('newShop', newShop);
        if(newShop){
            // Create privatekey and publickey
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            /* console.log('privateKey', privateKey);
            console.log('publicKey', publicKey); */

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });

            if (!keyStore){
                return {
                    code: 'xxxx',
                    message: 'Key store Error',
                    status: 'error'
                }
            }

            // Created token pair 
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey);
            console.log(`Create Token Success::`, tokens);
            return {
                code: 201,
                metadata: {
                    user: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                },
                status: 'success'
            }  
        }
        return {
            code: 200,
            metadata: null,
            status: 'error'
        }
    } catch (error) {
        return {
            code: 'xxx',
            message: error.message,
            status: 'error'
        }
    }
  }
}

module.exports = AccessService;