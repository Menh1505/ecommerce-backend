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
            const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                }
            });

            /* console.log('privateKey', privateKey);
            console.log('publicKey', publicKey); */

            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey
            });

            if (!publicKeyString){
                return {
                    code: 'xxxx',
                    message: 'Error create publicKey',
                    status: 'error'
                }
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString);
            // Created token pair 
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey);
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