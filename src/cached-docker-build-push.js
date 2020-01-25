const exec = require("@actions/exec");
const minimist = require("minimist");
const fs = require("fs");
const {
  dockerBuildCache,
  dockerBuildMultistageCache
} = require("./DockerBuild");

const isMultiStage = params => params.cacheStages.length >= 1;

const tryFindStages = (dockerfilePath = "./Dockerfile") => {
  const fileContent = fs.readFileSync(dockerfilePath, 'utf8')
  const stageName = fileContent.split(/\n/).reduce((memo, it) => {
    if (it[0] && it[0].trim() && it[0] == '#') return memo

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
    console.log("stages", stages)

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
  console.log(multiStage, params)
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

const parseCommands = (commands) => {
  const pullCommands = []
  const buildCommands = []
  const pushCommands = []

  commands.forEach(command => {
    if (/docker pull/.test(command)) {
      pullCommands.push(command)
    } else if (/docker build/.test(command)) {
      buildCommands.push(command)
    } else {
      pushCommands.push(command)
    }
  })

  return { pullCommands, buildCommands, pushCommands }
}

const dockerBuild = async function(inputs) {
  const commands = getCommands(inputs)
  console.log(commands)

  const { pullCommands, buildCommands, pushCommands } = parseCommands(commands)
  // skip fail
  try {
    for (let i = 0; i < pullCommands.length; i++) {
      const command = pullCommands[i];
      await exec.exec(command);
    }
  } catch {}

  // sync execute
  for (let i = 0; i < buildCommands.length; i++) {
    const command = buildCommands[i];
    await exec.exec(command);
  }

  for (let i = 0; i < pushCommands.length; i++) {
    const command = pushCommands[i];
    await exec.exec(command);
  }
};

module.exports = { dockerBuild, tryFindStages, getCommands, parseCommands };
