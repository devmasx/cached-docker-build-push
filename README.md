# Cached docker build push

Execute docker build and push using docker caches.

## Github Action

Build and push

```yml
- uses: devmasx/cached-docker-build-push@v0.2.2
  with:
    image_name: devmasx/project-name
    push: true
```

Build with multiple options

```yml
- uses: devmasx/cached-docker-build-push@v0.2.2
  with:
    image_name: devmasx/project-name-web
    image_tag: ${{ github.sha }}
    file: Dockerfile.web
    cache_stage_target: builder
    build_params: --build-arg=NPM_TOKEN=${{secrets.NPM_TOKEN}}
    push: true
```

Use your own docker authentication for private repositories
Examples:

Azure

```yml
- run: az acr login --name myregistry
- uses: devmasx/cached-docker-build-push@v0.2.2
  with:
    image_name: devmasx/project-name
```

Google cloud

```yml
- run: gcloud auth configure-docker
- uses: devmasx/cached-docker-build-push@v0.2.2
  with:
    image_name: devmasx/project-name
```

Docker Hub

```yml
- run: |
  docker login -u ${{secrets.DOCKER_USERNAME}} -p ${{secrets.DOCKER_PASSWORD}}
- uses: devmasx/cached-docker-build-push@v0.2.2
  with:
    image_name: devmasx/project-name
```
