FROM node:14.7.0

# create workdir
RUN mkdir -p /opt/app

# switch to workdir
WORKDIR /opt/app

# copy all files from context to workspace
COPY . .

# install
RUN ["npm", "install"]

# expose port
EXPOSE 8771

# run npm
CMD  ["npm", "start"]
