args=""

if [ ! -z $INPUT_IMAGE_NAME ]; then
  args+=" --image-name ${INPUT_IMAGE_NAME}"
fi

if [ ! -z $INPUT_IMAGE_TAG ]; then
  args+=" --image-tag ${INPUT_IMAGE_TAG}"
fi

if [ ! -z $INPUT_FILE ]; then
  args+=" --file ${INPUT_FILE}"
fi

if [ ! -z $INPUT_BUILD_PARAMS ]; then
  args+=" --build-params ${INPUT_BUILD_PARAMS}"
fi

if [ ! -z $INPUT_PRINT ]; then
  args+=" --print"
fi

if [ ! -z $INPUT_PUSH ]; then
  args+=" --push"
fi

cached-docker ${args}
