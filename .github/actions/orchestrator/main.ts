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
const token = Deno.env.get('GITHUB_TOKEN')!;
const owner = Deno.env.get('OWNER')!;
const pattern = Deno.env.get('PATTERN');
const pull_number = parseInt(Deno.env.get('PR')!, 10);
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
    name: file.name.replace('.yml', '').replace('.yaml', ''),
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

const matchingWorkflows = new Map<string, boolean>();
for (const workflowDetails of workflowDetailsList) {
  const match = changedFiles.find((filename) => filename.startsWith(workflowDetails.workingDirectory));
  if (match) {
    matchingWorkflows.set(workflowDetails.name, true);
  } else {
    matchingWorkflows.set(workflowDetails.name, false);
  }
}

const jsonResults = JSON.stringify(Object.fromEntries(matchingWorkflows));
core.info(jsonResults);
core.setOutput('json-results', jsonResults);
