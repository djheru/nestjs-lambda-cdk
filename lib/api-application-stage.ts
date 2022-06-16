import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './api-stack';

export interface ApiApplicationStageProps extends StageProps {
  certArn: string;
  domainName: string;
  stageName: string;
}

export class ApiApplicationStage extends Stage {
  constructor(scope: Construct, private id: string, props: ApiApplicationStageProps) {
    super(scope, id, props);

    const { certArn, domainName, stageName } = props;

    new ApiStack(this, `${this.id}-api`, {
      certArn,
      domainName,
      stageName,
    });
  }
}
