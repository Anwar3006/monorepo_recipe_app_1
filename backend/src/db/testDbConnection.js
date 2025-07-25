import dbClient from "./dbClient.js";

export const testDBConnection = async () => {
  try {
    const result = await dbClient.execute("SELECT 1");
    return result ? true : false;
  } catch (error) {
    throw new Error(
      "[TestDBConnection] Error testing DB connection: ",
      error.message
    );
  }
};
