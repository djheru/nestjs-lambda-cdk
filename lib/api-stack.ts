import {
  CorsHttpMethod,
  DomainName,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ARecord, HostedZone, NsRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';
import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { resolve } from 'path';

export interface ApiStackProps extends StackProps {
  domainName: string;
  stageName: string;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, private id: string, private props: ApiStackProps) {
    super(scope, id, props);

    const { domainName, stageName } = props;

    const stageDomainName = `${stageName}.${domainName}`;
    const appDomainName = `api.${stageDomainName}`;

    const hostedZoneId = pascalCase(`${this.id}-hostedZone`);
    const hostedZone = new HostedZone(this, hostedZoneId, {
      zoneName: appDomainName,
    });

    const parentHostedZone = HostedZone.fromLookup(
      this,
      pascalCase(`${hostedZoneId}-parent`),
      {
        domainName,
        privateZone: false,
      }
    );

    const certificateId = pascalCase(`${this.id}-cert`);
    const certificate = new Certificate(this, certificateId, {
      domainName: appDomainName,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const apigDomainName = new DomainName(this, pascalCase(`${this.id}-domain-name`), {
      domainName: appDomainName,
      certificate,
    });

    const httpApi = new HttpApi(this, pascalCase(`${this.id}-http-api`), {
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
        allowOrigins: ['http://localhost:3000', `https://www.${domainName}`],
      },
      defaultDomainMapping: {
        domainName: apigDomainName,
        mappingKey: 'v1',
      },
      disableExecuteApiEndpoint: true,
    });

    new CfnOutput(this, pascalCase(`${this.id}-domain-name-output`), {
      value: appDomainName,
    });

    new ARecord(this, pascalCase(`${this.id}-a-record`), {
      zone: hostedZone,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(
          apigDomainName.regionalDomainName,
          apigDomainName.regionalHostedZoneId
        )
      ),
    });

    new NsRecord(this, pascalCase(`${this.id}-ns-record`), {
      values: hostedZone.hostedZoneNameServers || [],
      zone: parentHostedZone,
      recordName: appDomainName,
      ttl: Duration.seconds(60),
    });

    const ddbTable = new Table(this, `${this.id}-mfa-table`, {
      tableName: 'MFATable',
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new CfnOutput(this, 'MFATableArn', {
      value: ddbTable.tableArn,
      exportName: 'MFATableArn',
    });

    const lambdaLayer = new LayerVersion(this, pascalCase(`${this.id}-lambda-layer`), {
      code: Code.fromAsset(resolve(__dirname, '../api/dist/node_modules')),
      compatibleRuntimes: [Runtime.NODEJS_14_X, Runtime.NODEJS_16_X],
      description: 'Node modules for lambda functions',
    });

    const handler = new Function(this, pascalCase(`${this.id}-lambda-fcn`), {
      code: Code.fromAsset(resolve(__dirname, '../api/dist'), {
        exclude: ['../api/dist/node_modules'],
      }),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_16_X,
      layers: [lambdaLayer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        TABLE_NAME: ddbTable.tableName,
      },
    });

    ddbTable.grantFullAccess(handler);

    httpApi.addRoutes({
      path: '/',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration(
        pascalCase(`${this.id}-http-integration`),
        handler
      ),
    });

    new CfnOutput(this, pascalCase(`${this.id}-api-url`), {
      value: httpApi.url!,
    });
  }
}
