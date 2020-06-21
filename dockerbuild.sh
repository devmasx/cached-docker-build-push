string=""

if [ ! -z $INPUT_IMAGE_NAME ]; then
  string+=" --image-name $INPUT_IMAGE_NAME"
fi

if [ ! -z $INPUT_IMAGE_TAG ]; then
  string+=" --image-tag $INPUT_IMAGE_TAG"
fi

if [ ! -z $INPUT_FILE ]; then
  string+=" --file $INPUT_FILE"
fi

if [ ! -z $INPUT_BUILD_PARAMS ]; then
  string+=" --build-params $INPUT_BUILD_PARAMS"
fi

if [ ! -z $INPUT_PRINT ]; then
  string+=" --print"
fi

if [ ! -z $INPUT_PUSH ]; then
  string+=" --push"
fi

echo cached-docker $string
