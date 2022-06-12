import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { resolve } from 'path';
import { pascalCase } from 'change-case';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ApiStack } from './api-stack';
import { ApiApplicationStage } from './api-application-stage';

export interface NestjsLambdaCdkStackProps extends StackProps {
  codestartConnectionArn: string;
  githubBranchName: string;
  githubPath: string;
}
export class ApiPipelineStack extends Stack {
  constructor(
    scope: Construct,
    private id: string,
    private props: NestjsLambdaCdkStackProps
  ) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, `${this.id}-pipeline`, {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          this.props.githubPath,
          this.props.githubBranchName,
          {
            connectionArn: this.props.codestartConnectionArn,
          }
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new ApiApplicationStage(this, 'Dev'));
  }
}
