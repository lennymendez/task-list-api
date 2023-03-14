'use-strict';

// Get access to the env variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
// Init fauna db
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const getUser = async req => {
    const data = req?.payload   
     try {
        const result = await client.query(q.If(
            q.Exists(q.Match(q.Index('users_by_user_email'), data.user.email)),
            q.Get(q.Match(q.Index('users_by_user_email'), data.user.email)),
            false
        ))
         return { result: result?.data, ok: result?.ts ? true : false }
     } catch (error) {
         console.error(error)
         return { message: 'Something went wrong' }
     }  
 }
 
 const createUser = async req => {
    const data = req?.payload
    client.query(q.Create(q.Collection('users'), { data: { ...data }}))
    return { status: 'User created' }
 }
 
 const updateUser = async req => {
    try {
        const data = req?.payload
        const result = await client.query(q.If(
            q.Exists(q.Match(q.Index('users_by_user_email'), data?.user?.email)),
            q.Update(q.Select(['ref'], q.Get(q.Match(q.Index('users_by_user_email'), data?.user?.email))), { data }),
            false
        ))
        return { result: result?.data, ok: result?.ts ? true : false }
    } catch (error) {
        console.error(error)
        return { message: 'Something went wrong' }
    }
 }

module.exports = {
  getUser: req => getUser(req),
  createUser: req => createUser(req),
  updateUser: req => updateUser(req)
};