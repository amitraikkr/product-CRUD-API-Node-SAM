const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    console.log('Recieved event:', JSON.stringify(event, null, 2));

    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        console.log('Product retrieved:', result.Items);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch(error){
        console.error('Error retrieving product:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve products'}),
        }
    }
}