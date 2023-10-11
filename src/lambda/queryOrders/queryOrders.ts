import { DynamoDB } from 'aws-sdk';
import { Order } from '../types/order'
import { Product } from '../types/product'
import { Customer } from '../types/customer';
import { OutputOrder } from "../types/outputOrder";
import {QueryOutput} from "aws-sdk/clients/dynamodb";

const dynamo = new DynamoDB.DocumentClient();

exports.handler = async (event: any): Promise<OutputOrder[]> => {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    if (event.info.fieldName === "orders") {
        const orders = await dynamo.scan({
            TableName: process.env.orderTable as string
        }).promise();
        const items: OutputOrder[] = await Promise.all(
            (orders.Items || []).filter(Boolean).map(order => processOrder(order as Order))
        );
        console.log(items);
        return items;
    }

    throw new Error("Unknown fieldName");
};

async function processOrder(order: Order){
    const outputObject = {
        orderId: order.orderId,
        date: order.date,
        totalAmount: order.totalAmount,
        products: []
    } as OutputOrder;

    const customer = await getCustomer(order.customerId);
    console.log(customer);
    if(customer) {
        console.log(customer);
        outputObject.customer = customer;
    }
    console.log("customer set");
    if(order.products && order.products.length > 0){
        outputObject.products = await getProducts(order.products);
    }

    return outputObject;
}

async function getCustomer(customerId: string){
    const customer = await dynamo.query({
        TableName: process.env.customerTable as string,
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
            ":customerId": customerId
        }
    }).promise();
    console.log(customer);
    if(customer.Items && customer.Items.length > 0) {
        return customer.Items[0] as unknown as Customer;
    }
    return undefined;
}


async function getProducts(orderProducts: Product[]) {
    interface Key {
        productId: string;
    }
    const keys: Key[] = [];

    orderProducts.map((product) => {
        keys.push({productId: product.productId});
    });

    const productTable: string = process.env.productTable as string;
    const params = {
        RequestItems: {
            [productTable]: {
                Keys: keys
            }
        }
    };
    const products = await dynamo.batchGet(params).promise();
    const outputProducts: Product[]  = [];
    if (products.Responses) {
        products.Responses[productTable].map(product => {
            const correctProduct = orderProducts.find((p) => p.productId === product.productId);
            const outputProduct = {
                price: product.price,
                quantity: correctProduct ? correctProduct.quantity : 0
            } as Product;
            outputProducts.push(outputProduct);
        })
    }
    return outputProducts;
}