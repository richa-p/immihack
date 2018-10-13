import {
    READ,
    WRITE,
  } from 'neo4j-driver/lib/v1/driver';
  import {
    zipObject,
    chain,
    pick,
    reduce,
  } from 'lodash';
  
  const neo4j = require('neo4j-driver').v1;
  
  export const neo4jUtil = mode => {
    // added the info for np neo4j instances to test connection from CF
    // const driver = neo4j.driver('bolt://localhost', 'neo4j', 'Monsanto123!');
    // const driver = neo4j.driver('bolt://localhost', 'neo4j', 'Monsanto123!');
    var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Monsanto123!"));
    const session = driver.session(mode);
    return { driver, session };
  };

  export const getSkillsPath = async () => {
    const result = await readTransaction("MATCH (ms:Skill { name: 'pre-dental' }),(cs:Skill { name: 'physiological-sciences' }), p = shortestPath((ms)-[:CAN_LEARN*]-(cs)) RETURN p");
    console.log(JSON.stringify(result))

    const path = chain(result.records)
    .map(record => zipObject(record.keys, record._fields))
    .value()
    console.log('***path****')
    console.log(JSON.stringify(path[0].p))
    const returnResult = path[0].p.segments.map(segment => {
      console.log(`Segment ${JSON.stringify(segment)}`)
      const start = segment.start.properties.name;
      const end = segment.end.properties.name
      return {
        start,
        end
      }
    })
    console.log(`Returned result set ${JSON.stringify(returnResult)}`);
    return returnResult;
  }
  
  
  export const closeSessionUtil = (session, driver) => {
    session.close();
    driver.close();
  };
  
  export const writeListTransaction = async (getQuery, variables, list) => {
    const { driver, session } = neo4jUtil(WRITE);
    const tx = session.beginTransaction();
    try {
      await Promise.all(list.map(async item => {
        const query = getQuery(variables, item);
        return tx.run(query, {});
      }));
      await tx.commit();
      closeSessionUtil(session, driver);
      return 'SUCCESS';
    }
    catch (error) {
      tx.rollback();
      closeSessionUtil(session, driver);
      console.log(error);
    }
  };
  
  export const readTransaction = async (query, { required = false } = {}) => {
    const { driver, session } = neo4jUtil(READ);
    try {
      const result = await session.readTransaction(tx => tx.run(query, {}));
      closeSessionUtil(session, driver);
      return result;
    }
    catch (error) {
      closeSessionUtil(session, driver);
      console.log(error);
    }
  };
  