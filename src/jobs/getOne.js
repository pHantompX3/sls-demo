const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  const id = event.pathParameters.id;
  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.JOBS_TABLE,
        Key: {
          id,
        },
      })
      .promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
