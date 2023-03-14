'use-strict';

const db = require('../db');

module.exports = [
    {
        method: 'POST',
        path: '/db/get-user',
        handler: req => {
            return db.getUser(req);
        }
    },
    {
        method: 'POST',
        path: '/db/create-user',
        handler: req => {
            return db.createUser(req);
        }
    },
    {
        method: 'POST',
        path: '/db/update-user',
        handler: req => {
            return db.updateUser(req);
        }
    }
];
