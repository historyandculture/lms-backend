const db = require('../database/db');
const { getOffset, emptyOrRows } = require('../helper');
const { spawn } = require('child_process');
const { getUser } = require('./user');
const events = require('events');
const emitter = new events.EventEmitter();


async function getTodo(id) {
    const rows = await db.query(
        `SELECT jsonstr 
    FROM todo where uid='${id}'`
    );
    const data = emptyOrRows(rows);
    if (data.length > 0)
        return data[0].jsonstr;
    else return null;
}

async function updateTodo(id, callback) {
    var user = await getUser(id);
    var jsondata;
    const python = spawn('python3', [`${__dirname}/../scripts/get_todo.py`, user.lms_sid, user.lms_pass]);
    python.stdout.on('data', function (data) {
        jsondata = data.toString();
    });
    python.on('exit', () => {
        var result = db.query(
            `INSERT INTO todo (uid, jsonstr) VALUES (${id}, '${jsondata}') ON DUPLICATE KEY UPDATE jsonstr='${jsondata}'`
        );
        message = 'Todo data created successfully';

        callback({ message, 'data': jsondata });
    });
}

module.exports = {
    getTodo,
    updateTodo
}