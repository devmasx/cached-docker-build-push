FROM docker:stable
RUN apk add libevent pcre libgcc git

RUN git clone https://github.com/devmasx/cached-docker ~/.cached-docker
RUN cp ~/.cached-docker/releases/linux/cached-docker /usr/local/bin/cached-docker

WORKDIR /action
COPY dockerbuild.sh /action/

CMD /action/dockerbuild.sh
