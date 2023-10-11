import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoStack extends Stack {
  public readonly customerTable: dynamodb.Table;
  public readonly orderTable: dynamodb.Table;
  public readonly productTable: dynamodb.Table;
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
    const customerTable = new dynamodb.Table(this, 'Customer', {
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'email', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    const orderTable = new dynamodb.Table(this, 'Order', {
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'customerId', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    const productTable = new dynamodb.Table(this, 'Product', {
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    new CfnOutput(this, 'customerTable', {
      value: customerTable.tableName,
    });

    new CfnOutput(this, 'orderTable', {
      value: orderTable.tableName,
    });

    new CfnOutput(this, 'productTable', {
      value: productTable.tableName,
    });

    this.customerTable = customerTable;
    this.orderTable = orderTable;
    this.productTable = productTable;

    console.log(customerTable.tableName);
    console.log(orderTable.tableName);
    console.log(productTable.tableName);
  }
}