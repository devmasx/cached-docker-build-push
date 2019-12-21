const { tryFindStages, getCommands } = require("../cached-docker-build-push");

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
      buildParams: "--dockerfile=src/__tests__/fixtures/Dockerfile.dev"
    });
    expect(commands).toMatchInlineSnapshot(`
      Array [
        "docker pull image-name:cache-builder",
        "docker pull image-name:cache-test",
        "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-builder   --target builder   -t image-name:cache-builder .",
        "docker build   --dockerfile=src/__tests__/fixtures/Dockerfile.dev   --cache-from=image-name:cache-test   --target test   -t image-name:cache-test .",
        "docker push image-name:cache-builder",
        "docker push image-name:cache-test",
        "docker push image-name:1576967513622",
        "docker push image-name",
      ]
    `);
  });
});
