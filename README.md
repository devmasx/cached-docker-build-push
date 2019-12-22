# Cached docker build push

Execute docker build and push using docker caches.

## Github Action

```yml
- uses: devmasx/cached-docker-build-push@v0.1.1
  with:
    image_name: devmasx/project-name
    cache_stage_target: builder
    build_params: --build-arg=NPM_TOKEN=${{secrets.NPM_TOKEN}}
```

Use your own docker authentication for private repositories
Examples:

Azure

```yml
- run: az acr login --name myregistry
- uses: devmasx/cached-docker-build-push@v0.1.1
  with:
    image_name: devmasx/project-name
```

Google cloud

```yml
- run: gcloud auth configure-docker
- uses: devmasx/cached-docker-build-push@v0.1.1
  with:
    image_name: devmasx/project-name
```

Docker Hub

```yml
- run: |
  docker login -u ${{secrets.DOCKER_USERNAME}} -p ${{secrets.DOCKER_PASSWORD}}
- uses: devmasx/cached-docker-build-push@v0.1.1
  with:
    image_name: devmasx/project-name
```

## Usage

## Docker build

Use the latest docker image for use as cache

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

With multi stage we need to save the builder stage for use as cache. All stages are build and push by default, or set the target using `--cache-stage-target`.

```
npx cached-docker-build-push --cache-stage-target=builder --image-name image-name --image-tag v1
```

Execute this docker commands:

```
docker pull image-name:cache-builder || exit 0

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

### See more

```
npx cached-docker-build-push --help
```
