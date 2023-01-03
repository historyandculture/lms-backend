const db = require('../database/db');
const { getOffset, emptyOrRows } = require('../helper');
const config = require('../config');
const bcrypt = require("bcryptjs");

async function getUsers(page = 1) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * 
    FROM user LIMIT ${offset},${config.listPerPage}`
    );
    const data = emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getUser(id) {
    const rows = await db.query(
        `SELECT * 
    FROM user where id='${id}'`
    );
    const data = emptyOrRows(rows);
    if (data.length > 0)
        return { "data": data };
    else return {};
}

async function getUserByEmail(email) {
    const rows = await db.query(
        `SELECT * 
    FROM user where email='${email}'`
    );
    const data = emptyOrRows(rows);
    if (data.length > 0)
        return { "data": data };
    else return {};
}


async function create(user) {
    const result = await db.query(
        `INSERT INTO user 
      (email, password, lms_sid, lms_pass) 
      VALUES 
      ('${user.email}', '${await bcrypt.hash(user.password, 10)}', '${user.lms_sid}', '${user.lms_pass}')`
    );

    let message = 'Error in creating user';

    if (result.affectedRows) {
        message = 'User created successfully';
    }

    return { message };
}

async function remove(id) {
    const result = await db.query(
        `DELETE FROM user WHERE id=${id}`
    );

    let message = 'Error in deleting user';

    if (result.affectedRows) {
        message = 'User deleted successfully';
    }

    return { message };
}
async function update(id, user) {
    let password = await bcrypt.hash(user.password, 10);
    const result = await db.query(
        `UPDATE user
      SET email='${user.email}', password='${password}', lms_sid='${user.lms_sid}', lms_pass='${user.lms_pass}'
      WHERE id=${id}`
    );

    let message = 'Error in updating user';

    if (result.affectedRows) {
        message = 'User updated successfully';
    }

    return { message };
}


module.exports = {
    getUsers,
    getUser,
    getUserByEmail,
    create,
    remove,
    update
}