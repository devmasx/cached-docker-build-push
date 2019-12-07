# Cached docker build push

Execute docker build and push using docker caches.

## Github Action

```yml
  - uses: devmasx/cached-docker-build-push@v0.1.0
    with:
      image_name: devmasx/project-name
      cache_stage_target: builder
      build_params: --build-arg=NPM_TOKEN=${{secrets.NPM_TOKEN}}
``
## Docker build

Use the latest docker image for use as cache
Docker commands example:

```

npx cached-docker-build-push --image-name image-name --image-tag v1

```

Execute this docker commands:

```

docker pull image-name || exit 0
docker build --cache-from=image-name -t image-name -t image-name:v1
docker push image-name:v1
docker push image-name

```

## Docker build with multi stage

With multi stage we need to save the builder stage for use as cache. Use the flag `--cache-stage-target` for define the builder stage

```

npx cached-docker-build-push --cache-stage-target=builder --image-name image-name --image-tag v1

```

Execute this docker commands:

```

docker pull image-name:cache-builder
docker build \
 --cache-from=image-name:cache-builder \
 --target builder \
 -t image-name:cache-builder \
 .

docker build \
 --cache-from=image-name:cache-builder \
 -t image-name \
 -t image-name:v1 \
 .

docker push image-name:cache-builder
docker push image-name:v1
docker push image-name

```

```
