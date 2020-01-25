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

const cacheFroms = (cacheStages, imageName) => cacheStages.map(({ name }) => `--cache-from=${name}`).join(' ')

const dockerBuildCacheStep = ({ target, name }, { imageName, buildParams, cacheStages }) => {

  return `docker build \
    ${buildParams} \
    ${cacheFroms(cacheStages, imageName)} \
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
    `docker pull ${imageName}`,
    ...cacheStages.map(({ name }) => `docker pull ${name}`),
    ...cacheStages.map(it => dockerBuildCacheStep(it, { imageName, buildParams, cacheStages })),
    `docker build \
      ${buildParams} \
      ${cacheFroms(cacheStages, imageName)} --cache-from=${imageName} \
      -t ${imageName} \
      -t ${imageName}:${imageTag} \
    .`,
    ...cacheStages.map(({ name }) => `docker push ${name}`),
    `docker push ${imageName}:${imageTag}`,
    `docker push ${imageName}`
  ];
};

module.exports = {
  dockerBuildCache,
  dockerBuildMultistageCache
};
