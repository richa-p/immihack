var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/ping", (req, res, next) => {
    res.json("Pong");
})
app.post("/skills", (req, res, next) => {
    console.log(`${JSON.stringify(req.body)}`);
    const data = {
        "paths": [
            {
                "from": "html",
                "to": "java",
                "path": [
                    "object-oriented-programming"
                ]
            },
            {
                "from": "",
                "to": "database mastery",
                "path": [
                    "database overview",
                    "sql",
                    "no-sql",
                ]
            }
        ]
    };
    res.json(data);
})
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

