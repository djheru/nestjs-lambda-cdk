#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { pascalCase } from 'change-case';
import 'dotenv/config';
import 'source-map-support/register';
import { PipelineStack } from '../lib/pipeline-stack';

console.log(process.env);

const {
  AWS_DEFAULT_ACCOUNT_ID,
  AWS_DEFAULT_REGION,
  CDK_DEFAULT_ACCOUNT,
  CDK_DEFAULT_REGION,
  CDK_ENV: environmentName = '',
  CODESTAR_CONNECTION_ARN: codestarConnectionArn = '',
  DOMAIN_NAME: domainName = '',
  GITHUB_OWNER: githubOwner = '',
  GITHUB_REPO: githubRepo = '',
  SERVICE_NAME: serviceName = '',
} = process.env;

if (
  ![
    environmentName,
    codestarConnectionArn,
    domainName,
    githubOwner,
    githubRepo,
    serviceName,
  ].every((el) => !!el)
) {
  throw new Error('Missing environment variables!');
}
const githubPath = `${githubOwner}/${githubRepo}`;

const githubBranchName = environmentName === 'prod' ? 'main' : environmentName;

const account = CDK_DEFAULT_ACCOUNT || AWS_DEFAULT_ACCOUNT_ID;
const region = CDK_DEFAULT_REGION || AWS_DEFAULT_REGION;

const app = new cdk.App();

new PipelineStack(app, pascalCase(serviceName), {
  description: `${pascalCase(serviceName)} Application`,
  env: { account, region },
  codestarConnectionArn,
  domainName,
  environmentName,
  githubBranchName,
  githubPath,
});
