const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");


app.use(cookieParser());

app.get("/getcookies", (req, res) => {
    res.cookie("Thanos", "Pain is inevitable ");
    res.send(req.cookies);

})

app.get("/getcookie", (req, res) => {
    res.cookie("Abhishek", "sharma ");
    res.send(req.cookies);
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am groot!");
});



app.get("/", (req, res) => {
    res.send("Am thor son of odin")
});

app.use("/users", users);

app.use("/posts", posts);


app.listen(8000, () => {
    console.log("server listening to: 8000");
});