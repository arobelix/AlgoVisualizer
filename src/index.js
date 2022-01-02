const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../main.html'));
});

app.get('/main.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/main.css'));
});
app.get('/mainTitleBackground.jpg', function(req, res) {
    res.sendFile
    (path.join(__dirname, '../assets/mainTitleBackground.jpg'));
});
app.get('/giftwrappingtest.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'giftwrappingtest.js'));
});


app.listen(port, () => {
    console.log("Listening");
})