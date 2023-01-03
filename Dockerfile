FROM node:16

RUN apt-get update || : && apt-get install python3 -y && apt-get install python3-pip -y

WORKDIR /usr/src/app
COPY package*.json ./
COPY requirements.txt ./requirements.txt
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --upgrade wheel
RUN python3 -m pip install -r requirements.txt

RUN npm install
COPY . .
EXPOSE 8808
RUN JWT_SECRET=$(echo $RANDOM | md5sum | head -c 20; echo;)
ENV NODE_ENV=production \
    PORT=8808
CMD [ "node", "src/index.js" ]