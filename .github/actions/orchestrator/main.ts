import { Octokit } from '@octokit/rest';
import { expandGlob } from 'jsr:@std/fs';

const root = Deno.env.get('GITHUB_WORKSPACE');
const token = Deno.env.get('GITHUB_TOKEN')!;
const owner = Deno.env.get('OWNER')!;
const pattern = Deno.env.get('PATTERN');
const pull_number = parseInt(Deno.env.get('PR')!, 10);
const repo = Deno.env.get('REPO')!.replace(`${owner}/`, '');

const octokit = new Octokit({
  auth: token,
});

for await (const file of expandGlob(`.github/workflows/${pattern}`, { root })) {
  console.log(file.path);
}

const changedFiles = await octokit.paginate(
  octokit.rest.pulls.listFiles,
  {
    owner,
    repo,
    pull_number,
  },
);
console.log('Changed files:', changedFiles.map((file) => file.filename));
