const exec = require("@actions/exec");
const minimist = require("minimist");
const fs = require("fs");
const {
  dockerBuildCache,
  dockerBuildMultistageCache
} = require("./DockerBuild");

const isMultiStage = params => params.cacheStages.length > 1;

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

const getCacheStages = ({ imageName, cacheStageTarget, buildParams }) => {
  if (cacheStageTarget) {
    return [
      {
        name: cacheImageName || `${imageName}:cache-${cacheStageTarget}`,
        target: cacheStageTarget
      }
    ]
  } else {
    const buildParamsArgv = minimist([buildParams]);
    const stages = tryFindStages(buildParamsArgv.dockerfile)

    return stages.map(stage => ({
      name: `${imageName}:cache-${stage}`,
      target: stage
    }))
  }
}

const getCommands = (inputs) => {
  let params = { ...inputs };
  params.cacheStages = getCacheStages(params)
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
