import {DynamoStack} from "./dynamo";
import {AppSyncStack} from "./appSync";
import {App} from "aws-cdk-lib";

// for development, use account/region from cdk cli
const devEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const dynamoStack = new DynamoStack(app, 'dynamo-dev', { env: devEnv });

console.log("DYNAMO DONE: " + dynamoStack.customerTable );
new AppSyncStack(app, 'appSync-dev', {
    env: devEnv,
    customerTable: dynamoStack.customerTable,
    orderTable: dynamoStack.orderTable,
    productTable:dynamoStack.productTable
});

app.synth();