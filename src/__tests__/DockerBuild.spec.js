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
    cacheStages: [
      { name: "image-name:cache-builder", target: "builder" },
      { name: "image-name:cache-test", target: "test" }
    ],
    cacheStageTarget: "builder",
    buildParams: "--dockerfile Dockerfile.dev"
  };

  it("#call", () => {
    const commands = dockerBuildMultistageCache(params);

    expect(commands).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name",
        "docker pull image-name:cache-builder",
        "docker pull image-name:cache-test",
        "docker build     --dockerfile Dockerfile.dev     --cache-from=image-name:cache-builder --cache-from=image-name:cache-test     --target builder     -t image-name:cache-builder   .",
        "docker build     --dockerfile Dockerfile.dev     --cache-from=image-name:cache-builder --cache-from=image-name:cache-test     --target test     -t image-name:cache-test   .",
        "docker build       --dockerfile Dockerfile.dev       --cache-from=image-name:cache-builder --cache-from=image-name:cache-test --cache-from=image-name       -t image-name       -t image-name:v1     .",
        "docker push image-name:cache-builder",
        "docker push image-name:cache-test",
        "docker push image-name:v1",
        "docker push image-name",
      ]
    `);
  });
});
