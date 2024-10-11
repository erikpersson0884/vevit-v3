FROM node:alpine

WORKDIR /vevit_frontend
COPY . .

RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]