if [ -z $INPUT_FILE ]; then
  DOCKERFILE_PATH="./Dockerfile"
else
  DOCKERFILE_PATH=$INPUT_FILE
fi

if [ -z $INPUT_PRINT ]; then
  cached-docker \
   --image-name $INPUT_IMAGE_NAME \
   --image-tag $INPUT_IMAGE_TAG \
   --file $DOCKERFILE_PATH \
   --push
else
  cached-docker \
   --image-name $INPUT_IMAGE_NAME \
   --image-tag $INPUT_IMAGE_TAG \
   --file $DOCKERFILE_PATH \
   --push
   --print
fi
