# if [ -z $INPUT_PRINT ] && [ -z $INPUT_FILE ]; then
  cached-docker \
   --image-name $INPUT_IMAGE_NAME \
   --image-tag $INPUT_IMAGE_TAG \
   --build-params $INPUT_BUILD_PARAMS \
  #  --push
  #  --cache-stage-target $INPUT_CACHE_STAGE_TARGET \
# else
  # cached-docker \
  #  --image-name $INPUT_IMAGE_NAME \
  #  --image-tag $INPUT_IMAGE_TAG \
  #  --build-params $INPUT_BUILD_PARAMS \
  #  --cache-stage-target $INPUT_CACHE_STAGE_TARGET
  #  --file
  #  --push
  #  --print
# fi
