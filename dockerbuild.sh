PARAMS=""
[ ! -z "$INPUT_IMAGE_NAME" ] && PARAMS="${PARAMS} --image-name=${INPUT_IMAGE_NAME} "

if [ ! -z  ]; then
  PARAMS+=" --image-name $INPUT_IMAGE_NAME"
fi

if [ ! -z $INPUT_IMAGE_TAG ]; then
  PARAMS="${PARAMS} --image-tag ${INPUT_IMAGE_TAG}"
fi

if [ ! -z $INPUT_FILE ]; then
  PARAMS="${PARAMS} --file ${INPUT_FILE}"
fi

if [ ! -z $INPUT_BUILD_PARAMS ]; then
  PARAMS="${PARAMS} --build-params ${INPUT_BUILD_PARAMS}"
fi

if [ ! -z $INPUT_PRINT ]; then
  PARAMS="${PARAMS} --print"
fi

if [ ! -z $INPUT_PUSH ]; then
  PARAMS="${PARAMS} --push"
fi

echo "cached-docker ${PARAMS}"
cached-docker ${PARAMS}
