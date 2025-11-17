const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rb03/18/05",
    database: "CFG"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

//  Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const [firstName, lastName] = username.split(" ");

    const sqlLogin = `SELECT * FROM REP WHERE FirstName = ? AND LastName = ? AND Password = ?`;
    db.query(sqlLogin, [firstName, lastName, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

//  Customer dropdown data
app.get("/customers", (req, res) => {
    const sql = "SELECT CustomerNum, CustomerName FROM Customer ORDER BY CustomerName ASC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching customers:", err);
            res.status(500).json({ success: false, message: "Error fetching customers." });
            return;
        }

        res.json({ success: true, data: results });
    });
});
//  rep report route
app.get("/rep-report", (req, res) => {
    const sqlRepReport = `
        SELECT
            R.FirstName,
            R.LastName,
            COUNT(C.CustomerNum) AS NumCustomers,
            AVG(C.Balance) AS AvgBalance

        FROM
            Rep R
        LEFT JOIN
            Customer C ON R.RepNum = C.RepNum
        GROUP BY
            R.RepNum
    `;

    db.query(sqlRepReport, (err, results) => {
        if (err) {
            console.error("Error fetching rep report:", err);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }

        res.json({ success: true, data: results });
    });


});


//  Order report route (uses CustomerNum now)
app.post("/order-report", (req, res) => {
    const { customerNum } = req.body;

    console.log("Received customerNum:", customerNum);

    const sqlOrderReport = `
        SELECT 
            C.CustomerName,
            SUM(OL.QuotedPrice * OL.NumOrdered) AS TotalQuotedPrice
        FROM 
            Customer C
        JOIN 
            Orders O ON C.CustomerNum = O.CustomerNum
        JOIN 
            OrderLine OL ON O.OrderNum = OL.OrderNum
        WHERE 
            C.CustomerNum = ?
        GROUP BY 
            C.CustomerName;
    `;

    db.query(sqlOrderReport, [customerNum], (err, results) => {
        if (err) {
            console.error("Error fetching order report:", err);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }

        if (results.length === 0) {
            res.json({ success: false, message: "No orders found for this customer." });
        } else {
            res.json({ success: true, data: results[0] });
        }
    });
});

// Add new representative
app.post("/add-rep", (req, res) => {
    const { repNum, firstName, lastName, password } = req.body;

    if (!repNum || !firstName || !lastName || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `INSERT INTO Rep (RepNum, FirstName, LastName, Password)
                 VALUES (?, ?, ?, ?)`;

    db.query(sql, [repNum, firstName, lastName, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ success: false, message: "Rep number already exists." });
            }
            console.error("Error inserting rep:", err);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }

        res.json({ success: true });
    });
});

// Update customer credit
app.post("/update-customer-credit", (req, res) => {
    const { customerNum, newCreditAmount } = req.body;

    if (!customerNum || !newCreditAmount) {
        return res.status(400).json({ success: false, message: "Customer number and new credit amount are required." });
    }

    const sqlUpdateCredit = `
        UPDATE Customer
        SET CreditLimit = ?
        WHERE CustomerNum = ?
    `;

    db.query(sqlUpdateCredit, [newCreditAmount, customerNum], (err, result) => {
        if (err) {
            console.error("Error updating customer credit:", err);
            return res.status(500).json({ success: false, message: "Error updating credit limit." });
        }

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "Customer not found." });
        }

        res.json({ success: true, message: "Customer credit updated successfully." });
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

