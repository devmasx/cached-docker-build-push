if [ ! -z $INPUT_PRINT ]; then
  cached-docker \
   --image-name $INPUT_IMAGE_NAME \
   --image-tag $INPUT_IMAGE_TAG \
   --build-params $INPUT_BUILD_PARAMS \
   --file $INPUT_FILE \
   --cache-stage-target $INPUT_CACHE_STAGE_TARGET \
   --print
else
  cached-docker \
   --image-name $INPUT_IMAGE_NAME \
   --image-tag $INPUT_IMAGE_TAG \
   --build-params $INPUT_BUILD_PARAMS \
   --file $INPUT_FILE \
   --cache-stage-target $INPUT_CACHE_STAGE_TARGET
fi
