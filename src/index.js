const core = require("@actions/core");
const { dockerBuild } = require("./cached-docker-build-push");

async function run() {
  try {
    dockerBuild({
      imageName: core.getInput("image_name"),
      imageTag: core.getInput("image_tag") || process.env.GITHUB_SHA,
      cacheImageName: core.getInput("cache_image_name"),
      cacheStageTarget: core.getInput("cache_stage_target"),
      buildParams: core.getInput("build_params")
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
