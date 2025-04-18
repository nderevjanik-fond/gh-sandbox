import { Octokit } from '@octokit/rest';
import { expandGlob } from 'jsr:@std/fs';
import { parse } from 'jsr:@std/yaml/parse';

type GitHubWorkflowYaml = {
  defaults: {
    run: {
      'working-directory': string;
    };
  };
};

type WorkflowDetails = {
  filePath: string;
  name: string;
  workingDirectory: string;
};

const root = Deno.env.get('GITHUB_WORKSPACE')!;
const token = Deno.env.get('GITHUB_TOKEN')!;
const owner = Deno.env.get('OWNER')!;
const pattern = Deno.env.get('PATTERN');
const pull_number = parseInt(Deno.env.get('PR')!, 10);
const ref = Deno.env.get('REF')!;
const repo = Deno.env.get('REPO')!.replace(`${owner}/`, '');

const octokit = new Octokit({
  auth: token,
});

const workflowDetailsList: WorkflowDetails[] = [];
for await (const file of expandGlob(`.github/workflows/${pattern}`, { root })) {
  const contents = await Deno.readTextFile(file.path);
  const yaml = parse(contents) as GitHubWorkflowYaml;
  const details: WorkflowDetails = {
    filePath: `.github/workflows/${file.name}`,
    name: file.name,
    workingDirectory: yaml.defaults.run['working-directory'],
  };
  workflowDetailsList.push(details);
}

const results = await octokit.paginate(
  octokit.rest.pulls.listFiles,
  {
    owner,
    repo,
    pull_number,
  },
);
const changedFiles = results.map((file) => file.filename);

const matchingWorkflowDetails: WorkflowDetails[] = [];
for (const workflowDetails of workflowDetailsList) {
  const match = changedFiles.find((filename) => filename.startsWith(workflowDetails.workingDirectory));
  if (match) {
    matchingWorkflowDetails.push(workflowDetails);
  }
}

for (const workflowDetails of matchingWorkflowDetails) {
  console.log(`changes detected in: ${workflowDetails.workingDirectory}`);
  console.log(`dispatching workflow: ${workflowDetails.filePath}`);

  await octokit.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id: workflowDetails.name,
    ref,
  });
}
