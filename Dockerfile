
FROM rayms/ionicbuilder:latest as builder

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir -p /usr/src/app && cp -R ./node_modules /usr/src/app

WORKDIR /usr/src/app

COPY . .

## Add platform on separate layer
RUN npm run platforms

RUN npm run build-prod

FROM builder as signer

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY --from=builder /usr/src/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./
COPY ./accord-release-key.keystore ./

RUN jarsigner -keypass password -storepass password -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore accord-release-key.keystore app-release-unsigned.apk accord-r-k

RUN zipalign -v 4 ./app-release-unsigned.apk accord.apk

CMD ["/bin/bash"]
