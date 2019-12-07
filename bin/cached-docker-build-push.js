#! /usr/bin/env node
const { dockerBuild } = require("../src/cached-docker-build-push");
const argv = require("minimist")(process.argv.slice(2));

if (argv.help || Object.keys(argv).length == 1) {
  return console.log(`
  usage: [--image-name] [--image-tag] [--build-params]
         [--cache-stage-target] [--cache-image-name]

      --image-name
      Image name, required

      --image-tag
      Image tag, required

      --build-params
      Add any docker build flag, --build-params="--build-arg=TOKEN=$TOKEN"

      --cache-stage-target
      Name of the stage target for use in cache, two images will be compiled, the stage target and the last stage.

      --cache-image-name
      Image name for the cache image, default $IMAGE_NAME:cache-$CACHE_STAGE_TARGET
  `);
}

const inputs = {
  imageName: argv["image-name"],
  imageTag: argv["image-tag"],
  cacheImageName: argv["cache-image-name"],
  cacheStageTarget: argv["cache-stage-target"],
  buildParams: argv["build-params"]
};
dockerBuild(inputs);
