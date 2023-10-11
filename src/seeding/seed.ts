import { DynamoDB } from 'aws-sdk';
import * as fs from 'fs';

import AWS from 'aws-sdk';
AWS.config.update({region:'eu-central-1'});

const dynamo = new DynamoDB.DocumentClient();

async function loadJsonFile(filename: string): Promise<any[]> {
    const content = await fs.promises.readFile(filename, 'utf-8');
    return JSON.parse(content);
}

async function seedCustomers() {
    const customers = await loadJsonFile('./data/customers.json');

    for (const customer of customers) {
        const params = {
            TableName: process.env.customerTableName as string,
            Item: {
                customerId: `CUSTOMER#${customer.customerId}`,
                email: customer.email,
                fullName: customer.fullName
            }
        };

        await dynamo.put(params).promise();
        console.log(`Added customer: ${customer.email}`);
    }
}

async function seedOrders() {
    const orders = await loadJsonFile('./data/orders.json');

    for (const order of orders) {
        const params = {
            TableName:  process.env.orderTableName as string,
            Item: {
                orderId: `ORDER#${order.orderId}`,
                customerId: `CUSTOMER#${order.email}`,
                date: order.date,
                totalAmount: order.totalAmount,
                productsQuantity: order.products
            }
        };

        await dynamo.put(params).promise();
        console.log(`Added order: ${order.orderId}`);
    }
}

async function seedProducts() {
    const products = await loadJsonFile('data/products.json');

    for (const product of products) {
        const params = {
            TableName: process.env.productTableName as string,
            Item: {
                productId: `PRODUCT#${product.productId}`,
                price: product.price,
                name: product.name
            }
        };

        await dynamo.put(params).promise();
        console.log(`Added product: ${product.name}`);
    }
}

async function main() {
    console.log(process.env.customerTableName);
    await seedCustomers();
    await seedOrders();
    await seedProducts();
}

main().catch(error => {
    console.error("Error seeding data:", error);
});