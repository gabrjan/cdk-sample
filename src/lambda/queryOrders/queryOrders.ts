import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();

exports.handler = async (event: any) => {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    if (event.fieldName === "orders") {
        const orders = await dynamo.query({
            TableName: process.env.customerTable as string,
            KeyConditionExpression: "PK begins_with :prefix",
            ExpressionAttributeValues: {
                ":prefix": "ORDER#"
            }
        }).promise();

        return orders.Items?.map(async (order: any) => {
            const customerKey = order.SK;
            const customer = await dynamo.get({
                TableName: process.env.ordersTable as string,
                Key: {
                    PK: customerKey,
                    SK: `#METADATA#${customerKey.split('#')[1]}`
                }
            }).promise();

            return {
                orderId: order.orderId,
                date: order.date,
                totalAmount: order.totalAmount,
                customer: customer.Item,
                products: [
                    // Dummy data for this example; a real implementation would fetch associated products.
                    { price: 500, quantity: 2 }
                ]
            };
        });
    }

    throw new Error("Unknown fieldName");
};