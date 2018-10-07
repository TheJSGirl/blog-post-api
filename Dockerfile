FROM node:carbon

# Create app directory
WORKDIR /usr/src/app
# Intall app dependencies
COPY package*.json ./

RUN npm install

# Bundle the app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]