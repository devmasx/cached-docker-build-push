const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


// git diff --name-only HEAD~1 HEAD~2

const owner = "devmasx";
const repo = "cached-docker-build-push";

(async () => {

  // const response4 = await octokit.request("GET /repos/:owner/:repo/git/refs/:ref", {
  //   owner,
  //   repo,
  //   ref: "heads/test-commit",
  // });

  // console.log(response4.data)

  const tree = [{
    path: 'new_file.txt',
    mode: '100644',
    content: 'My new file'
  }];

  // Get latest commit and tree
  const response = await octokit.request("GET /repos/:owner/:repo/commits/a81eb661e79d84ae116cbfaff94f9f60502b50a9", { owner, repo });
  const tree_sha = response.data.commit.tree.sha
  // const latest_commit_sha = response.data.sha;
  const latest_commit_sha = "a81eb661e79d84ae116cbfaff94f9f60502b50a9";

  console.log(tree_sha)
  console.log(latest_commit_sha)
  // Save changes
  const response2 = await octokit.request("POST /repos/:owner/:repo/git/trees", { owner, repo, base_tree: tree_sha, tree })
  const new_tree_sha = response2.data.sha;

  // Commit changes
  const response3 = await octokit.request("POST /repos/:owner/:repo/git/commits", {
    owner,
    repo,
    message: 'Commit message',
    tree: new_tree_sha,
    parents: [latest_commit_sha]
  });
  console.log(response3.data.sha)
  console.log(response3.data.url)
  console.log(response3.data.message)


  // git rev-parse --abbrev-ref HEAD
  // Update branch (push)
  const response4 = await octokit.request("PATCH /repos/:owner/:repo/git/refs/:ref", {
    owner,
    repo,
    ref: "heads/test-commit",
    sha: response3.data.sha,
  })

  // console.log(response4.data)
})()

// response = client.get("", sha: base, per_page: 1)
// tree_sha = response[0].commit.tree.sha
// latest_commit_sha = response[0].sha

// response = client.post("/repos/#{owner}/#{repo}/git/trees", base_tree: tree_sha, tree: tree)
// new_tree_sha = response.sha

// response = client.post("/repos/#{owner}/#{repo}/git/commits",
//                        message: changes[:commit], tree: new_tree_sha, parents: [latest_commit_sha])
// latest_commit_sha = response.sha
