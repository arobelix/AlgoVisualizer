const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/index.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.css'));
});

app.get('/dfs.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'dfs.js'));
});

app.listen(port, () => {
    console.log("Listening");
})