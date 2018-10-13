// import {
//     READ,
//     WRITE,
//   } from 'neo4j-driver/lib/v1/driver';

  
  const neo4j = require('neo4j-driver').v1;
//   const READ = neo4j.lib.v1.driver;
  
  export const neo4jUtil = mode => {
    // added the info for np neo4j instances to test connection from CF
    const driver = neo4j.driver('bolt://localhost:7687', 'neo4j', 'Monsanto123!');
    const session = driver.session(mode);
    return { driver, session };
  };
  
  
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
  