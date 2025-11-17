Banking Application

A full-stack banking management system built with Node.js, Express, MySQL, HTML/CSS, and vanilla JavaScript.
This application was developed as part of a database course and demonstrates relational database operations, secure login, reporting, and CRUD functionality across multiple customer and representative workflows.

🚀 Features
🔐 User Authentication

Representative login system (first name + last name + password)

Default login for demo/testing:
Username: Rafael Campos
Password: password123

📊 Reports

Representative Report: Displays each rep, number of customers, and their average balance

Customer Order Report: Calculates total quoted price for all orders for a selected customer

👤 Representative Management

Add a new representative (with duplicate RepNum validation)

💳 Customer Management

Update customer credit limit

Dynamic customer dropdowns

🖥️ Clean Frontend UI

Modal-based interface

Responsive layout

Fully asynchronous API-based workflow

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL
Other: CORS, Body-Parser

📁 Project Structure
/
├── mainIndex.html
├── mainScript.js
├── mainStyles.css
├── loginIndex.html
├── server.js
└── README.md

🧩 How It Works
Frontend (View)

Handles UI, user inputs, and async fetch calls to backend.

Backend (Controller)

Express routes for login, reports, adding reps, and updating customer credit.

Database (Model)

MySQL with tables:

Rep

Customer

Orders

OrderLine

🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/login	Validates representative credentials
Customers
Method	Endpoint	Description
GET	/customers	Retrieves customer list
POST	/update-customer-credit	Updates a customer’s credit limit
Representatives
Method	Endpoint	Description
GET	/rep-report	Generates representative summary report
POST	/add-rep	Adds a new representative
Orders
Method	Endpoint	Description
POST	/order-report	Generates total quoted price for a selected customer
⚙️ Setup & Installation
1. Clone the repository
git clone https://github.com/yourusername/banking-application.git
cd banking-application

2. Install dependencies
npm install

3. Configure MySQL

Create and configure a database named CFG.

Update credentials in server.js if needed:

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your-password",
    database: "CFG"
});

4. Run the server
node server.js


Server runs on:

http://localhost:3000

5. Open the frontend

Open loginIndex.html to start at the login page.

🔐 Login Credentials for Demo

Use the following credentials to log in:

Username: Rafael Campos
Password: password123

🧪 SQL Examples
Representative Report
SELECT
    R.FirstName,
    R.LastName,
    COUNT(C.CustomerNum) AS NumCustomers,
    AVG(C.Balance) AS AvgBalance
FROM Rep R
LEFT JOIN Customer C ON R.RepNum = C.RepNum
GROUP BY R.RepNum;

Order Report
SELECT C.CustomerName,
       SUM(OL.QuotedPrice * OL.NumOrdered) AS TotalQuotedPrice
FROM Customer C
JOIN Orders O ON C.CustomerNum = O.CustomerNum
JOIN OrderLine OL ON O.OrderNum = OL.OrderNum
WHERE C.CustomerNum = ?
GROUP BY C.CustomerName;

📌 Future Improvements

Password hashing

Admin dashboard

Transaction history reporting

Pagination for large datasets

Convert frontend to React

Docker containerization
