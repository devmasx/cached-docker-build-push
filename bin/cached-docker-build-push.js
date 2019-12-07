#! /usr/bin/env node
const { dockerBuild } = require("../src/cached-docker-build-push");
const argv = require("minimist")(process.argv.slice(2));

if (argv.help) {
  return console.log(`
  usage: [--image-name] [--image-tag] [--cache-image-name]
         [--cache-stage-target] [--build-params]
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
