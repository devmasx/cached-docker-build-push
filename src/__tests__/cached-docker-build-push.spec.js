const { tryFindStages } = require('../cached-docker-build-push')

describe("tryFindStage", () => {
  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile")
    expect(name).toEqual(["builder"])
  })

  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile.dev")
    expect(name).toEqual(["builder", "test"])
  })

  it("dockerfile", () => {
    const name = tryFindStages("src/__tests__/fixtures/Dockerfile.test")
    expect(name).toEqual([])
  })
})
