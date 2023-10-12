# AWS CDK Backend Developer Test Task

This is a sample AWS CDK TypeScript project that demonstrates how to create and manage AWS infrastructure using the AWS CDK. 
It creates DynamoDB tables and AppSync for querying the data.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (>=16.x)
- [TypeScript](https://www.typescriptlang.org/) (>=4.x)
- [AWS CDK](https://aws.amazon.com/cdk/) (>=2.x)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with necessary permissions)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/gabrjan/cdk-sample
   ```

2. Build lambda code:

   ```bash
   npm run build-code
   ```

3. Configure AWS credentials for your AWS account:

   ```bash
   aws configure
   ```
4. Install dependecies.

      ```bash
   npm install
   ```
   
5. Configure aws cdk.

      ```bash
   cdk bootstrap
   ```

6. Deploy the AWS CDK Stack:

   ```bash
   cdk deploy
   ```
After deployment, the AWS CDK will provide outputs such as endpoint URL, DynamoDb table names, etc. Make a note of these.

7. Seed the data

Save dynamo table names from output of above to environment variables as **orderTableName**, **productTableName** and **customerTableName**
   ```bash
   cd src/seeding
   seeding % ts-node ./seed.ts
  ```
8. Test it

In output of deploy you got appSync-dev.GraphQLAPIURL open the url with Postman for graphQl, and execute it with schema.



## Deploying Changes

Whenever you make changes to your CDK app, follow these steps to update your AWS infrastructure:

1. Build the TypeScript project:

   ```bash
   npm run build-code
   ```

2. Deploy the updated stack:

   ```bash
   cdk deploy
   ```

## Cleaning Up

To remove the AWS resources created by your CDK app, run the following command:

```bash
cdk destroy
```

## Useful Links

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS CDK TypeScript API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```