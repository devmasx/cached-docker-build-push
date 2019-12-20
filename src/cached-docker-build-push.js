const exec = require("@actions/exec");
const minimist = require("minimist");
const fs = require("fs");
const {
  dockerBuildCache,
  dockerBuildMultistageCache
} = require("./DockerBuild");

const isMultiStage = params => params.cacheStageTarget;

const tryFindStages = (dockerfilePath = "./Dockerfile") => {
  const fileContent = fs.readFileSync(dockerfilePath, 'utf8')
  const stageName = fileContent.split(/\n/).reduce((memo, it) => {
    let match = /FROM/.test(it) && it.match(/(?<=(as|AS) ).*$/);
    if (match) {
      memo.push(match[0])
    }
    return memo
   }, [])
  return stageName
}

const getCacheImageName = ({ cacheImageName, imageName, cacheStageTarget }) => {
  return cacheImageName || `${imageName}:cache-${cacheStageTarget}`;
};

const getCommands = (inputs) => {
  let params = { ...inputs };
  const buildParams = minimist([inputs.buildParams]);
  params.cacheStageTarget = params.cacheStageTarget || tryFindStages(buildParams.dockerfile)[0]
  params.cacheImageName = getCacheImageName(params)
  params.imageTag = params.imageTag || `${new Date().getTime()}`

  const multiStage = isMultiStage(params);
  let commands = [];

  if (multiStage) {
    console.log("**Build with multiStage cache**");
    commands = dockerBuildMultistageCache(params);
  } else {
    console.log("**Build with latest cache**");
    commands = dockerBuildCache(params);
  }
  return commands
}

const dockerBuild = async function(inputs) {
  const commands = getCommands(inputs)
  console.log(commands)

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

module.exports = { dockerBuild, tryFindStages, getCommands };
