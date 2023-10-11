"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Incoming event:", JSON.stringify(event, null, 2));
    if (event.info.fieldName === "orders") {
        const orders = yield dynamo.scan({
            TableName: process.env.orderTable
        }).promise();
        const items = yield Promise.all((orders.Items || []).filter(Boolean).map(order => processOrder(order)));
        console.log(items);
        return items;
    }
    throw new Error("Unknown fieldName");
});
function processOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputObject = {
            orderId: order.orderId,
            date: order.date,
            totalAmount: order.totalAmount,
            products: []
        };
        const customer = yield getCustomer(order.customerId);
        console.log(customer);
        if (customer) {
            console.log(customer);
            outputObject.customer = customer;
        }
        console.log("customer set");
        if (order.products && order.products.length > 0) {
            outputObject.products = yield getProducts(order.products);
        }
        return outputObject;
    });
}
function getCustomer(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield dynamo.query({
            TableName: process.env.customerTable,
            KeyConditionExpression: "customerId = :customerId",
            ExpressionAttributeValues: {
                ":customerId": customerId
            }
        }).promise();
        console.log(customer);
        if (customer.Items && customer.Items.length > 0) {
            return customer.Items[0];
        }
        return undefined;
    });
}
function getProducts(orderProducts) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = [];
        orderProducts.map((product) => {
            keys.push({ productId: product.productId });
        });
        const productTable = process.env.productTable;
        const params = {
            RequestItems: {
                [productTable]: {
                    Keys: keys
                }
            }
        };
        const products = yield dynamo.batchGet(params).promise();
        const outputProducts = [];
        if (products.Responses) {
            products.Responses[productTable].map(product => {
                const correctProduct = orderProducts.find((p) => p.productId === product.productId);
                const outputProduct = {
                    price: product.price,
                    quantity: correctProduct ? correctProduct.quantity : 0
                };
                outputProducts.push(outputProduct);
            });
        }
        return outputProducts;
    });
}
