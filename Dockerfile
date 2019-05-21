ARG NODE_VERSION=10.15.3

# First build is just the base image that helps work around no layer caching in CircleCi
# is pulled from the Heroku Container Registry so it's layers
FROM node:${NODE_VERSION}-stretch AS base
WORKDIR /scratch

# Following is used in the CI build
ADD https://github.com/LLK/scratch-vm/archive/develop.tar.gz /scratch/vm.tar.gz
RUN tar xfz vm.tar.gz 
ADD https://github.com/LLK/scratch-gui/archive/develop.tar.gz /scratch/gui.tar.gz
RUN tar xfz gui.tar.gz

# The following is used for faster local testing
# ADD scratch-vm-develop.tar.gz /scratch
# ADD scratch-gui-develop.tar.gz /scratch

RUN mv /scratch/scratch-vm-develop /scratch/scratch-vm
RUN mv /scratch/scratch-gui-develop /scratch/scratch-gui

COPY scratch/gui/index.jsx /scratch/scratch-gui/src/lib/libraries/extensions/index.jsx
# Remove other extensions - especially the music extensions with large mp3 files
RUN rm -r /scratch/scratch-vm/src/extensions/*
COPY scratch/extensions /scratch/scratch-vm/src/extensions/custom
COPY build/contracts /scratch/scratch-vm/src/extensions/custom/contracts
COPY scratch/vm/extension-manager.js /scratch/scratch-vm/src/extension-support/extension-manager.js

WORKDIR /scratch/scratch-gui

RUN npm set progress=false && \
   npm config set depth 0 && \
   npm install && \
   npm cache clean --force

WORKDIR /scratch/scratch-vm

RUN npm set progress=false && \
   npm config set depth 0 && \
   npm install && \
   npm install web3@0.20.3 && \
   npm cache clean --force

RUN npm link

WORKDIR /scratch/scratch-gui

# Link the Scratch GUI to the modified Scratch VM
RUN npm link scratch-vm

# Build the react app into the /scratch/gui/build folder
RUN npm run build

# Build the production image
FROM nginx:alpine AS web
COPY --from=base /scratch/scratch-gui/build /usr/share/nginx/html
COPY scratch/nginx.conf /etc/nginx/conf.d/default.conf
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
