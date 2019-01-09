FROM node:10
WORKDIR /home/ec2-user/robiatdir
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]