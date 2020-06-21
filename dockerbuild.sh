PARAMS=""
echo $INPUT_IMAGE_NAME
# [ ! -z "$INPUT_IMAGE_NAME" ] && PARAMS+=" --image-name=$INPUT_IMAGE_NAME"

# if [ ! -z  ]; then
#   # PARAMS+=" --image-name $INPUT_IMAGE_NAME"
# fi

# if [ ! -z $INPUT_IMAGE_TAG ]; then
#   # PARAMS+=" --image-tag $INPUT_IMAGE_TAG"
# fi

# if [ ! -z $INPUT_FILE ]; then
#   # PARAMS+=" --file $INPUT_FILE"
# fi

# if [ ! -z $INPUT_BUILD_PARAMS ]; then
#   # PARAMS+=" --build-params $INPUT_BUILD_PARAMS"
# fi

# if [ ! -z $INPUT_PRINT ]; then
#   # PARAMS+=" --print"
# fi

# if [ ! -z $INPUT_PUSH ]; then
#   # PARAMS+=" --push"
# fi

echo cached-docker $PARAMS
