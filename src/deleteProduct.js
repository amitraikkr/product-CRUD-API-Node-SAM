const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    console.log('Recieved event:', JSON.stringify(event,null, 2));

    const productId = event.pathParameters.id;

    const params = {
        TableName: TABLE_NAME,
        key: {
            ProductId: productId,
        },
    };

    try {
        const result = await dynamoDb.delete(params).promise();
        console.log('Product deleted:', productId);
        return {
            statusCode: 204,
            body: null,
        };
    } catch (error) {
        console.error('Error deleting product:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not delete product'})
        };
    }
}