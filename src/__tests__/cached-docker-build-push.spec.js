const {
  tryFindStages,
  getCommands,
  parseCommands
} = require("../cached-docker-build-push");

describe("tryFindStage", () => {
  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile");
    expect(name).toEqual(["builder"]);
  });

  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile.dev");
    expect(name).toEqual(["builder", "test"]);
  });

  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile.test");
    expect(name).toEqual([]);
  });
});

describe("getCommands", () => {
  it("multistage infered", () => {
    const commands = getCommands({
      imageName: "image-name",
      buildParams: "--dockerfile=src/__tests__/fixtures/Dockerfile.dev",
      imageTag: "v1"
    });
    expect(commands).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name:cache-builder",
        "docker pull image-name:cache-test",
        "docker build     --dockerfile=src/__tests__/fixtures/Dockerfile.dev     --cache-from=image-name:cache-builder --cache-from=image-name:cache-test     --target builder     -t image-name:cache-builder   .",
        "docker build     --dockerfile=src/__tests__/fixtures/Dockerfile.dev     --cache-from=image-name:cache-builder --cache-from=image-name:cache-test     --target test     -t image-name:cache-test   .",
        "docker push image-name:cache-builder",
        "docker push image-name:cache-test",
        "docker push image-name:v1",
        "docker push image-name",
      ]
    `);
  });
});

describe("parseCommands", () => {
  it("multistage infered", () => {
    const commands = parseCommands([
      "docker pull image-name:cache-builder",
      "docker pull image-name:cache-test",
      "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-builder   --target builder   -t image-name:cache-builder .",
      "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-test   --target test   -t image-name:cache-test .",
      "docker push image-name:cache-builder",
      "docker push image-name:cache-test",
      "docker push image-name:v1",
      "docker push image-name"
    ]);
    expect(commands).toMatchInlineSnapshot(`
      Object {
        "buildCommands": Array [
          "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-builder   --target builder   -t image-name:cache-builder .",
          "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-test   --target test   -t image-name:cache-test .",
        ],
        "pullCommands": Array [
          "docker pull image-name:cache-builder",
          "docker pull image-name:cache-test",
        ],
        "pushCommands": Array [
          "docker push image-name:cache-builder",
          "docker push image-name:cache-test",
          "docker push image-name:v1",
          "docker push image-name",
        ],
      }
    `);
  });
});
