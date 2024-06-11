const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

exports.handler = async (event) => {
    console.log('Recieved event:', JSON.stringify(event, null, 2))

    const productId = event.pathParameters.id;
    let data;

    try{
        data = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({error: 'Invalid request body'}),
        };
    }

    const params = {
        TableName: TABLE_NAME,
        key: {
            ProductId: productId,
        },
        UpdateExpression: 'SET #name = :name, #description = :description, #price = :price, #category = :category, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#name' : 'Name',
            '#description' : 'Description',
            '#price': 'Price',
            '#category': 'Category',
            '#updatedAt' : 'UpdatedAt',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':description': data.description,
            ':price': data.price,
            ':category': data.category,
            ':updatedAt': new Date().toISOString(),
        },
        returnValues: 'ALL_NEW'
    };

    try{
        const result = await dynamoDb.update(params).promise();
        console.log('Product updated:', result.Attributes);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes)
        };
    } catch(error) {
        console.error('Error updating product:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Could not update product'})
        };
    }
}