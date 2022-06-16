import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { pascalCase } from 'change-case';
import { Construct } from 'constructs';
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

    const pipelineId = `${this.id}-pipeline`;
    const pipeline = new CodePipeline(this, pipelineId, {
      pipelineName: pascalCase(pipelineId),
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

    pipeline.addStage(new ApiApplicationStage(this, `${pipelineId}-dev`));
  }
}
