import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { resolve } from 'path';

export class NestjsLambdaCdkStack extends Stack {
  constructor(scope: Construct, private id: string, private props?: StackProps) {
    super(scope, id, props);

    const httpApi = new HttpApi(this, `${this.id}-http-api`, {
      description: 'Sample HTTP API with Lambda integration running Nestjs',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    const lambdaLayer = new LayerVersion(this, `${this.id}-lambda-layer`, {
      code: Code.fromAsset(resolve(__dirname, '../api/dist/node_modules')),
      compatibleRuntimes: [Runtime.NODEJS_14_X, Runtime.NODEJS_16_X],
      description: 'Node modules for lambda functions',
    });

    const handler = new Function(this, `${this.id}-lambda-fcn`, {
      code: Code.fromAsset(resolve(__dirname, '../api/dist'), {
        exclude: ['../api/dist/node_modules'],
      }),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_16_X,
      layers: [lambdaLayer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        IS_FUNKY: 'TRUE',
      },
    });

    httpApi.addRoutes({
      path: '/',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration(`${this.id}-http-integration`, handler),
    });

    new CfnOutput(this, `${this.id}-api-url`, {
      value: httpApi.url!,
    });
  }
}
