import mysql from 'mysql2/promise'

export const mysqldb = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "Atul@1234",
    database: "testdb"
}
)

export const mysqlconection = (async () => {
    try {
        await mysqldb.getConnection()
        console.log("Mysql connected..");

    } catch (error) {
        console.error("MySQL Connection Failed:", error);

    }
})
