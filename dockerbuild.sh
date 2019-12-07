BUILDPARAMS=${INPUT_EXTRA_BUILD_PARAMS}
CACHE_IMAGE_NAME=${INPUT_CACHE_IMAGE_NAME}
CACHE_STAGE_TARGET=${INPUT_CACHE_STAGE_TARGET}

# Select image cache
if [ ! -z $CACHE_IMAGE_NAME ]; then
  echo "**Build with multiStage cache**"

  docker pull ${CACHE_IMAGE_NAME} || echo '0'
  docker build \
    ${BUILDPARAMS} \
    --target ${CACHE_STAGE_TARGET} \
    --cache-from=${CACHE_IMAGE_NAME} \
    -t ${CACHE_IMAGE_NAME} \
    .
  docker build \
    ${BUILDPARAMS} \
    --cache-from=${CACHE_IMAGE_NAME} \
    -t ${IMAGE_NAME} \
    -t ${IMAGE_NAME}:${IMAGE_TAG} \
    .
  docker push ${CACHE_IMAGE_NAME}
  docker push ${IMAGE_NAME}:${IMAGE_TAG}
else
  echo "**Build with latest cache**"
  docker pull ${IMAGE_NAME} || echo '0'
  docker build \
    ${BUILDPARAMS} \
    --cache-from=${IMAGE_NAME} \
    -t ${IMAGE_NAME} \
    -t "${IMAGE_NAME}:${IMAGE_TAG}" \
    .
  docker push ${IMAGE_NAME}:${IMAGE_TAG}
  docker push ${IMAGE_NAME}
fi

echo "Finish ${IMAGE_NAME}:${IMAGE_TAG}"
