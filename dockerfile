FROM beevelop/ionic:v4.10.3 as builder

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir -p /usr/src/app && cp -R ./node_modules /usr/src/app

WORKDIR /usr/src/app

COPY . .

## Add platform on separate layer
RUN npm run platforms

RUN npm run build-prod

FROM beevelop/ionic:v4.10.3 as signer

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY --from=builder /usr/src/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./
COPY ./accord-release-key.keystore ./

COPY package.json ./

RUN npm run sign-apk

RUN npm run zip-align
