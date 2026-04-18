const express = require("express");
const app = express();
const path = require("path");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session")
const flash = require("connect-flash");
const { request } = require("https");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions =  {
     secret: "mysupersecretstring", 
     resave: false, 
     saveUninitialized: true
    }


app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("Successful!!", "user registered successfully!");
    res.redirect("/hello");
});

app.get("/hello", (req, res)=> {
    console.log(req.flash("success"));
    res.render("page.ejs", { name: req.session.name });
});


// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     }
//     else {
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

app.get("/test", (req, res) => {
    res.send("Csk won the toss!");
});

app.listen(8000, () => {
    console.log("server listening to: 8000");
});