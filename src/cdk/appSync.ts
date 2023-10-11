import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';
import { CustomStackProps } from './interfaces/customStackProps';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    // Makes a GraphQL API construct
    const api = new appsync.GraphqlApi(this, 'query-orders', {
      name: 'query-orders',
      definition: appsync.Definition.fromFile('src/schema/schema.graphql')
    });

    const lambdaForQuery = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'queryOrders.handler',
      code: lambda.Code.fromAsset('src/lambda/build'), // Path to your Lambda function code
      environment:{
        customerTable: props.customerTable.tableName,
        orderTable: props.orderTable.tableName,
        productTable: props.productTable.tableName
      }
    });


    // Create a data source for your Lambda function
    const lambdaDataSource = api.addLambdaDataSource('LambdaDataSource', lambdaForQuery);

    // Define a resolver that uses the Lambda data source
    lambdaDataSource.createResolver('sampleResolver', {
      typeName: 'Query',
      fieldName: 'orders'
    });



    // Prints out URL
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });
  }
}