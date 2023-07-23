import { Stage, StageProps } from 'aws-cdk-lib';
import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { ApiStack } from './api-stack';

export interface ApplicationStageProps extends StageProps {
  domainName: string;
  stageName: string;
}

export class ApplicationStage extends Stage {
  constructor(
    scope: Construct,
    private id: string,
    props: ApplicationStageProps
  ) {
    super(scope, id, props);

    const { domainName, stageName } = props;

    new ApiStack(this, pascalCase(`${this.id}-api`), {
      stackName: pascalCase(`${this.id}-api-stack`),
      domainName,
      stageName,
      env: props.env,
    });
  }
}
