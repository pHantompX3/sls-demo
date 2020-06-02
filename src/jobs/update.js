const uuid = require('uuid');
const Joi = require('joi');
const dynamoDB = require('../dynamodb');
const schema = Joi.object().keys({
  title: Joi.string().required(),
  published: Joi.boolean().required(),
}); 

module.exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const timestamp = new Date().getTime();
  const id = event.pathParameters.id;

// Joi validation
  try {
    const {error, value} = Joi.validate(data, schema);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e.details),
    };
  }

  const params = {
    TableName: process.env.JOBS_TABLE,
    Key: {
      id,
    },
    // this allows us to preload the attribute values, variables that will be holding the data at runtime
    UpdateExpression: 
      'SET title= :title, published= :published, updatedAt= :updatedAt',
      // here is where the data is loaded into the variables
      ExpressionAttributeValues:{
      ':title': data.title,
      ':published': data.published,
      ':updatedAt': timestamp
    },
    ReturnValues: 'ALL_NEW'
    // this tells dynamo to return the updated record's new atributes 
  };


  try {
    // exevuting the update method in dynabo db
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
