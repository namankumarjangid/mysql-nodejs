const express = require('express');
const app = express();
const path = require('path');
const PORT = 5000;
const hbs = require('hbs');
const mysql = require('mysql');
const { error } = require('console');


const static_path = path.join(__dirname, "./public");
const templates_path = path.join(__dirname, "./templates/views");
const partials_path = path.join(__dirname, "./templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


// node and mysql database connection and local variables
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodesql"
})

connection.connect((err) => {
    if (err) {
        console.log("Error Connection");
    } else {
        console.log("Connencted !");
    }
})



app.get("", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.get("/search", (req, res) => {
    res.render("search")
});

app.post("/register", (req, res) => {
    const { name, email, education, country } = req.body;
    connection.query("INSERT INTO register (name,email,education,country) VALUES (?,?,?,?)",
        [name, email, education, country], (error, result) => {
            if (error) throw error;
            res.redirect("register");
        })
});

app.post("/search", (req, res) => {
    const email = req.body.email;
    connection.query("SELECT * FROM register WHERE email = ?", [email], (error, result) => {
        if (error) throw error;
        console.log(result);
        if (result.length == 0) {
            msg = "empty"
        } else {
            msg = "data"
        }
        res.render('search', { msg: msg, data: result[0] })
    });
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

