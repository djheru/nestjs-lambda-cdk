#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApiPipelineStack } from '../lib/api-pipeline-stack';

const app = new cdk.App();
new ApiPipelineStack(app, 'nestjs-lambda-cdk', {
  codestartConnectionArn:
    'arn:aws:codestar-connections:us-east-1:205375198116:connection/e54f0a47-fef3-4cf8-8734-bb679211c671',
  domainName: 'flexiledger.com',
  githubBranchName: 'main',
  githubPath: 'djheru/nestjs-lambda-cdk',
});
