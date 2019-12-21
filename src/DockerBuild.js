const dockerBuildCache = ({ imageName, imageTag, buildParams = "" }) => {
  return [
    `docker pull ${imageName}`,
    `docker build \
  ${buildParams} \
  --cache-from=${imageName} \
  -t ${imageName} \
  -t ${imageName}:${imageTag} \
  .`,
    `docker push ${imageName}:${imageTag}`,
    `docker push ${imageName}`
  ];
};

const dockerBuildCacheStep = ({ target, name }, buildParams, cacheStages) => {
  const cacheFroms = cacheStages.map(({ name }) => `--cache-from=${name}`).join(' ')

  return `docker build \
    ${buildParams} \
    ${cacheFroms} \
    --target ${target} \
    -t ${name} \
  .`
}

const dockerBuildMultistageCache = ({
  imageName,
  imageTag,
  cacheStages,
  buildParams = ""
}) => {
  return [
    ...cacheStages.map(({ name }) => `docker pull ${name}`),
    ...cacheStages.map(it => dockerBuildCacheStep(it, buildParams, cacheStages)),
    ...cacheStages.map(({ name }) => `docker push ${name}`),
    `docker push ${imageName}:${imageTag}`,
    `docker push ${imageName}`
  ];
};

module.exports = {
  dockerBuildCache,
  dockerBuildMultistageCache
};
