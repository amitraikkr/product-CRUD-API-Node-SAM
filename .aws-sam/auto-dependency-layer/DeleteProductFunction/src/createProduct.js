const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

exports.handler = async (event) => {
    let data;
    console.log(event)
    try{
        data = JSON.parse(event.body);
    } catch (error){
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body'})
        };
    }

    const params = {
        TableName: TABLE_NAME,
        Item: {
            ProductId: uuid.v1(),
            Name: data.name,
            Description: data.description,
            Price: data.price,
            Category: data.category,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        }
    };

    try{
        await dynamodb.put(params).promise();
        return {
            statusCode: 201,
            body:JSON.stringify(params.Item)
        };
    }catch(error) {
        console.error('Error creating proudct:', error);
        return {
            statusCode: 500,
            body: JSON.stringify ({ error: 'Could not create product'})
        }
    }



}

