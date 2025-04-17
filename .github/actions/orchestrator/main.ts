import { Octokit } from '@octokit/rest';

const token = Deno.env.get('GITHUB_TOKEN')!;
const owner = Deno.env.get('OWNER')!;
const repo = Deno.env.get('REPO')!.replace(`${owner}/`, '');
const pull_number = parseInt(Deno.env.get('PR')!, 10);

const octokit = new Octokit({
  auth: token,
});

const changedFiles = await octokit.paginate(
  octokit.rest.pulls.listFiles,
  {
    owner,
    repo,
    pull_number,
  },
);
console.log('Changed files:', changedFiles.map((file) => file.filename));
