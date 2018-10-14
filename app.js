var express = require("express");
var app = express();
var bodyParser = require('body-parser');
// var getSkillsPath = require('./neo4j.utils');
import { getSkillsPath } from './neo4j.utils';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/ping", (req, res, next) => {
    res.json("Pong");
})
app.post("/skills", async (req, res, next) => {
    console.log(`${JSON.stringify(req.body)}`);
    const result = await getSkillsPath();
    // const result = await neo4j.readTransaction("MATCH (ms:Skill { name: 'pre-dental' }),(cs:Skill { name: 'physiological-sciences' }), p = shortestPath((ms)-[:CAN_LEARN*]-(cs)) RETURN p");
    // console.log(result.records)

    // const returnResult = chain(result.records)
    // .map(record => zipObject(record.keys, record._fields))
    // .value()

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
    res.json({
        data,
        actual: result
    });
})

app.get("/mechanical/:mechanical/hands/:hands/creative/:creative/categories", async (req, res, next) => {
    console.log(`${req.params.mechanical} - ${req.params.hands}`)
    res.json([
        "IT",
        "Farming"
    ])
})

app.get("/mechanical/:mechanical/hands/:hands/creative/:creative/jobtitles", async (req, res, next) => {
    console.log(`${req.params.mechanical} - ${req.params.hands}`)
    const data = [
        {
          category: 'Tech',
          jobs: [
            {
              name: 'Help Desk',
              level: 'Entry Level',
              other: {data: 'a link or something?'}
            }
          ]
        }
      ]
    res.json(data)
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

