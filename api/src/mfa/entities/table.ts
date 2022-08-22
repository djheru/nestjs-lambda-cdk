import DynamoDB from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import dotenv from 'dotenv';
import { Table } from 'dynamodb-toolbox';

dotenv.config();

const params: DynamoDB.DocumentClient.DocumentClientOptions &
  ServiceConfigurationOptions = {
  region: 'us-east-1',
  convertEmptyValues: false,
};
if (process.env.DYNAMODB_ENDPOINT) {
  params.endpoint = process.env.DYNAMODB_ENDPOINT;
}
const DocumentClient = new DynamoDB.DocumentClient(params);

export const MfaTable = new Table({
  name: 'MFATable',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient,
});
