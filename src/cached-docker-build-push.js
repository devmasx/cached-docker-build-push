const exec = require("@actions/exec");
const {
  dockerBuildCache,
  dockerBuildMultistageCache
} = require("./DockerBuild");

const isMultiStage = params => params.cacheStageTarget;

const getCacheImageName = ({ cacheImageName, imageName, cacheStageTarget }) => {
  return cacheImageName || `${imageName}:cache-${cacheStageTarget}`;
};

const dockerBuild = async function(inputs) {
  let params = { ...inputs };

  const multiStage = isMultiStage(params);
  let commands = [];
  if (multiStage) {
    params = {
      ...params,
      cacheImageName: getCacheImageName(params)
    };

    console.log("**Build with multiStage cache**");
    commands = dockerBuildMultistageCache(params);
  } else {
    console.log("**Build with latest cache**");
    commands = dockerBuildCache(params);
  }
  const [pullImage, ...syncCommands] = commands;

  // skip fail
  try {
    await exec.exec(pullImage);
  } catch {}

  // sync execute
  for (let i = 0; i < syncCommands.length; i++) {
    const command = syncCommands[i];
    await exec.exec(command);
  }
};

module.exports = { dockerBuild };
