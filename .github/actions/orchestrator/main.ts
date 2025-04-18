import core from '@actions/core';
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

const token = core.getInput('github-token');
const owner = core.getInput('owner');
const pattern = core.getInput('pattern');
const pull_number = parseInt(core.getInput('pr'), 10);
const repo = core.getInput('repo').replace(`${owner}/`, '');

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

console.log(matchingWorkflowDetails);
