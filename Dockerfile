FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm rebuild bcrypt --build-from-source



EXPOSE 5000
CMD [ "node", "index.js" ]

