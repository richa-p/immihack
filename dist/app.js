'use strict';

var _neo4j = require('./neo4j.utils');

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
// var getSkillsPath = require('./neo4j.utils');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/ping", function (req, res, next) {
    res.json("Pong");
});
app.post("/skills", async function (req, res, next) {
    console.log('' + JSON.stringify(req.body));
    var result = (0, _neo4j.getSkillsPath)();
    // const result = await neo4j.readTransaction("MATCH (ms:Skill { name: 'pre-dental' }),(cs:Skill { name: 'physiological-sciences' }), p = shortestPath((ms)-[:CAN_LEARN*]-(cs)) RETURN p");
    // console.log(result.records)

    // const returnResult = chain(result.records)
    // .map(record => zipObject(record.keys, record._fields))
    // .value()

    var data = {
        "paths": [{
            "from": "html",
            "to": "java",
            "path": ["object-oriented-programming"]
        }, {
            "from": "",
            "to": "database mastery",
            "path": ["database overview", "sql", "no-sql"]
        }]
    };
    res.json(data);
});
app.listen(3000, function () {
    console.log('Server listening on port 3000');
});