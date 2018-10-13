var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var neo4j = require('./neo4j.utils');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/ping", (req, res, next) => {
    res.json("Pong");
})
app.post("/skills", (req, res, next) => {
    console.log(`${JSON.stringify(req.body)}`);
    const result = neo4j.readTransaction("MATCH (ms:Skill { name: 'pre-dental' }),(cs:Skill { name: 'physiological-sciences' }), p = shortestPath((ms)-[:CAN_LEARN*]-(cs)) RETURN p");
    console.log(result)

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

