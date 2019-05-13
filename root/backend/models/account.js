'use strict'
const bcrypt = require('bcrypt')
const Filter = require('bad-words')

const filter = new Filter();
const SALT_ROUNDS = 10

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,// TODO: split into username_display and username_id = lower(username_display)
            validate: {
                is: /^(?=.*[A-Za-z])[A-Za-z0-9d._-]{1,}$/,
                isNotProfane(value) {
                    if(filter.isProfane(value)) {
                        throw new Error('Inappropriate Username')
                    }
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$!.%*#?&]{8,}/
            }
        }
    }, {
        hooks: {
            beforeCreate: (account) => {
                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
                        if(err) reject(err)
                        bcrypt.hash(account.password, salt, (err, hash) => {
                            if(err) reject(err)
                            account.password = hash
                            resolve()
                        })
                    })
                })
            }
        }
    })
    Account.associate = function(models) {
        // associations can be defined here
    }

    // list accounts
    // limit: up to <limit> accounts shown
    Account.list = function(limit=20) {
        return new Promise((resolve, reject) => {
            Account.findAll({ limit: limit })
                .then(accounts => { resolve(accounts) })
                .catch(err => { reject(err) })
        })
    }

    Account.post = function(username, email, password) {
        return new Promise((resolve, reject) => {
            Account.build({
                username,
                email,
                password
            }).save()
                .then(account => { resolve(account) })
                .catch(err => {
                    reject(err)
                })
        })
    }

    return Account
}