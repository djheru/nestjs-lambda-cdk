#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApiPipelineStack } from '../lib/api-pipeline-stack';

const app = new cdk.App();
new ApiPipelineStack(app, 'nestjs-lambda-cdk', {
  certArn:
    'arn:aws:acm:us-east-1:205375198116:certificate/69088012-9678-4013-9762-5660609c5a39',
  codestartConnectionArn:
    'arn:aws:codestar-connections:us-east-1:205375198116:connection/e54f0a47-fef3-4cf8-8734-bb679211c671',
  domainName: 'flexiledger.com',
  githubBranchName: 'main',
  githubPath: 'djheru/nestjs-lambda-cdk',
});
