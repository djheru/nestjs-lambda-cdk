#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NestjsLambdaCdkStack } from '../lib/nestjs-lambda-cdk-stack';

const app = new cdk.App();
new NestjsLambdaCdkStack(app, 'nestjs-lambda-cdk', {});
