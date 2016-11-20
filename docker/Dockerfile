FROM ubuntu:16.04
MAINTAINER Martin Acosta <tinchoz49@gmail.com>
RUN apt-get update && apt-get install -y fontconfig libsndfile1 libopenal-dev libssl-dev libglew-dev libcairo2 libxrandr-dev libxi-dev libxcursor-dev libfreeimage-dev libboost-filesystem-dev
EXPOSE 50000/udp
WORKDIR /oscServer
COPY data /oscServer/data
COPY rootOscServer /oscServer/rootOscServer
CMD ["./rootOscServer"]
