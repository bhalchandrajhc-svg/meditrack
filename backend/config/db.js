const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "medi_track"
});

db.connect((err) => {

    if (err) {
        console.log("Database Error:", err);
    } else {
        console.log("MySQL Connected");
    }

});

module.exports = db;