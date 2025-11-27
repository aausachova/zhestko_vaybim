# use lightweight Node.js image
FROM node:18-alpine

# create application folder
WORKDIR /app

# first copy only dependency description (for caching)
COPY package.json .

# install libraries INSIDE the image
RUN npm install

# copy all other code (runner.js, test.js, etc.)
COPY . .

# default command (will run your test)
CMD ["node", "test.js"]