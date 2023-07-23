import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
import { ApplicationStage } from './application-stage';

const {
  CDK_ENV = '',
  CODESTAR_CONNECTION_ARN = '',
  DOMAIN_NAME = '',
  GITHUB_OWNER = '',
  GITHUB_REPO = '',
  SERVICE_NAME = '',
} = process.env; // values already validated in cdk bin/api-app.ts

export interface PipelineStackProps extends StackProps {
  codestarConnectionArn: string;
  domainName: string;
  environmentName: string;
  githubBranchName: string;
  githubPath: string;
}
export class PipelineStack extends Stack {
  constructor(
    scope: Construct,
    private id: string,
    private props: PipelineStackProps
  ) {
    super(scope, id, props);

    const { domainName, environmentName: stageName } = props;

    const pipelineId = pascalCase(`${this.id}-pipeline`);
    const pipeline = new CodePipeline(this, pipelineId, {
      pipelineName: pipelineId,
      synth: new ShellStep('Synth', {
        env: {
          CDK_ENV,
          CODESTAR_CONNECTION_ARN,
          DOMAIN_NAME,
          GITHUB_OWNER,
          GITHUB_REPO,
          SERVICE_NAME,
        },
        input: CodePipelineSource.connection(
          this.props.githubPath,
          this.props.githubBranchName,
          {
            connectionArn: this.props.codestarConnectionArn,
          }
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    const applicationStage = new ApplicationStage(
      this,
      pascalCase(`${this.id}-${stageName}`),
      {
        domainName,
        stageName,
        env: this.props.env,
      }
    );

    pipeline.addStage(applicationStage);
  }
}
