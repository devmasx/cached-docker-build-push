const {
  dockerBuildCache,
  dockerBuildMultistageCache
} = require("../DockerBuild");

describe("DockerBuildCache", () => {
  let params = {
    imageName: "image-name",
    imageTag: "v1"
  };

  it("#call", () => {
    const commads = dockerBuildCache(params);
    expect(commads).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name",
        "docker build      --cache-from=image-name   -t image-name   -t image-name:v1   .",
        "docker push image-name:v1",
        "docker push image-name",
      ]
    `);
  });

  it("#call with build params", () => {
    const commads = dockerBuildCache({
      ...params,
      buildParams: "--dockerfile Dockerfile.dev"
    });
    expect(commads).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name",
        "docker build   --dockerfile Dockerfile.dev   --cache-from=image-name   -t image-name   -t image-name:v1   .",
        "docker push image-name:v1",
        "docker push image-name",
      ]
    `);
  });
});

describe("dockerBuildMultistageCache", () => {
  let params = {
    imageName: "image-name",
    imageTag: "v1",
    cacheImageName: "image-name--builder",
    cacheStageTarget: "development",
    buildParams: "--dockerfile Dockerfile.dev"
  };

  it("#call", () => {
    const commands = dockerBuildMultistageCache(params);

    expect(commands).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name--builder",
        "docker build       --dockerfile Dockerfile.dev       --cache-from=image-name--builder       --target development       -t image-name--builder       -t image-name:v1     .",
        "docker build       --dockerfile Dockerfile.dev       --cache-from=image-name       -t image-name       -t image-name:v1     .",
        "docker push image-name--builder",
        "docker push image-name:v1",
        "docker push image-name",
      ]
    `);
  });
});
