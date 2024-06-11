const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event,null, 2))

    const productId = event.pathParameter.id;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            ProductId: productId,
        },
    };

    try{
        const result = await dynamoDb.get(params).promise()

        if (!result.Item) {
            console.warn('Product with ID ${produdctID} not found.')
            return {
                statusCode: 404,
                body: JSON.stringify ({ error: 'Product not found'})
            };
        }

        console.log('Product retrieved:', result.Item);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch(error) {
        console.error('Error retrieving product', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve product'}),
        };
    }
}