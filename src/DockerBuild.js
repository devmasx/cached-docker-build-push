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

const dockerBuildMultistageCache = ({
  imageName,
  imageTag,
  cacheImageName,
  cacheStageTarget,
  buildParams = ""
}) => {
  return [
    `docker pull ${cacheImageName}`,
    `docker build \
      ${buildParams} \
      --cache-from=${cacheImageName} \
      --target ${cacheStageTarget} \
      -t ${cacheImageName} \
    .`,
    `docker build \
      ${buildParams} \
      --cache-from=${cacheImageName} \
      -t ${imageName} \
      -t ${imageName}:${imageTag} \
    .`,
    `docker push ${cacheImageName}`,
    `docker push ${imageName}:${imageTag}`,
    `docker push ${imageName}`
  ];
};

module.exports = {
  dockerBuildCache,
  dockerBuildMultistageCache
};
