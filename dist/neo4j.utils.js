'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readTransaction = exports.writeListTransaction = exports.closeSessionUtil = exports.getSkillsPath = exports.neo4jUtil = undefined;

var _driver = require('neo4j-driver/lib/v1/driver');

var _lodash = require('lodash');

var neo4j = require('neo4j-driver').v1;

var neo4jUtil = exports.neo4jUtil = function neo4jUtil(mode) {
  // added the info for np neo4j instances to test connection from CF
  // const driver = neo4j.driver('bolt://localhost', 'neo4j', 'Monsanto123!');
  // const driver = neo4j.driver('bolt://localhost', 'neo4j', 'Monsanto123!');
  var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Monsanto123!"));
  var session = driver.session(mode);
  return { driver: driver, session: session };
};

var getSkillsPath = exports.getSkillsPath = async function getSkillsPath() {
  var result = await readTransaction("MATCH (ms:Skill { name: 'pre-dental' }),(cs:Skill { name: 'physiological-sciences' }), p = shortestPath((ms)-[:CAN_LEARN*]-(cs)) RETURN p");
  console.log(JSON.stringify(result));

  var path = (0, _lodash.chain)(result.records).map(function (record) {
    return (0, _lodash.zipObject)(record.keys, record._fields);
  }).value();
  console.log('***path****');
  console.log(path);
  var returnResult = path.p.segments.map(function (segment) {
    var start = segment.start.properties[0];
    var end = segment.end.properties[0];
    return start + '-' + end;
  });
  console.log('Returned result set ' + JSON.stringify(returnResult));
  return returnResult;
};

var closeSessionUtil = exports.closeSessionUtil = function closeSessionUtil(session, driver) {
  session.close();
  driver.close();
};

var writeListTransaction = exports.writeListTransaction = async function writeListTransaction(getQuery, variables, list) {
  var _neo4jUtil = neo4jUtil(_driver.WRITE),
      driver = _neo4jUtil.driver,
      session = _neo4jUtil.session;

  var tx = session.beginTransaction();
  try {
    await Promise.all(list.map(async function (item) {
      var query = getQuery(variables, item);
      return tx.run(query, {});
    }));
    await tx.commit();
    closeSessionUtil(session, driver);
    return 'SUCCESS';
  } catch (error) {
    tx.rollback();
    closeSessionUtil(session, driver);
    console.log(error);
  }
};

var readTransaction = exports.readTransaction = async function readTransaction(query) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$required = _ref.required,
      required = _ref$required === undefined ? false : _ref$required;

  var _neo4jUtil2 = neo4jUtil(_driver.READ),
      driver = _neo4jUtil2.driver,
      session = _neo4jUtil2.session;

  try {
    var result = await session.readTransaction(function (tx) {
      return tx.run(query, {});
    });
    closeSessionUtil(session, driver);
    return result;
  } catch (error) {
    closeSessionUtil(session, driver);
    console.log(error);
  }
};