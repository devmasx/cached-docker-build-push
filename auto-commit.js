const { Octokit } = require("@octokit/rest");
const exec = require('@actions/exec');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
// https://developer.github.com/v3/repos/commits/
// https://developer.github.com/v3/git/trees/
// https://developer.github.com/v3/git/refs/#update-a-reference
// git diff --name-only HEAD~1 HEAD~2

const getFilesChanges = async () => {
  let myOutput = '';
  const options = {
    silent: true,
    listeners: {
      stdout: (data) => {
        myOutput += data.toString();
      }
    }
  };
  const result = await exec.exec('git', ["diff", "--name-only", "HEAD~1", "HEAD~2"], options);
  return myOutput.split("\n").filter(it => it)
};

(async () => {
  await getFilesChanges().then(console.log)
})()

// (async () => {
//   const owner = "devmasx";
//   const repo = "cached-docker-build-push";
//   const brachName = "test-commit"
//   const commitMessage = "Commit message"

//   const tree = [{
//     path: 'new_file.txt',
//     mode: '100644',
//     content: 'My new file 3'
//   }];

//   const response0 = await octokit.request("GET /repos/:owner/:repo/commits", { owner, repo, sha: brachName });
//   const latestCommitSHA = response0.data[0].sha

//   // Get latest commit and tree
//   const response1 = await octokit.request(`GET /repos/:owner/:repo/commits/${latestCommitSHA}`, { owner, repo });
//   const base_tree = response1.data.commit.tree.sha

//   // Save changes
//   const response2 = await octokit.request("POST /repos/:owner/:repo/git/trees", { owner, repo, base_tree, tree })
//   const new_tree_sha = response2.data.sha;

//   // Commit changes
//   const response3 = await octokit.request("POST /repos/:owner/:repo/git/commits", {
//     owner,
//     repo,
//     message: commitMessage,
//     tree: new_tree_sha,
//     parents: [latestCommitSHA]
//   });

//   // git rev-parse --abbrev-ref HEAD
//   // Update branch (push)
//   const response4 = await octokit.request("PATCH /repos/:owner/:repo/git/refs/:ref", {
//     owner,
//     repo,
//     ref: `heads/${brachName}`,
//     sha: response3.data.sha,
//   })

//   console.log(response4.data)
// })()
