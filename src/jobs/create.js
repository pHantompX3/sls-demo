const uuid = require('uuid');
const Joi = require('joi');
const dynamoDB = require('../dynamodb');

module.exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const timestamp = new Date().getTime();

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    published: Joi.boolean().required(),
  });
  const params = {
    TableName: process.env.JOBS_TABLE,
    Item: {
      id: uuid.v1(),
      title: data.title,
      published: data.published,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    const {error, value} = Joi.validate(data, schema);
    if(error)
      throw error;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e.details),
    };
  }

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
