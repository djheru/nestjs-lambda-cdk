import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiStack } from './api-stack';

export class ApiApplicationStage extends Stage {
  constructor(scope: Construct, private id: string, props?: StageProps) {
    super(scope, id, props);

    new ApiStack(this, `${this.id}-api`);
  }
}
