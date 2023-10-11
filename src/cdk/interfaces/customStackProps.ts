import { StackProps } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface CustomStackProps extends StackProps {
  customerTable: dynamodb.Table;
  orderTable: dynamodb.Table;
  productTable: dynamodb.Table;
}