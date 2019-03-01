
FROM ubuntu:18.04 as android

RUN apt-get update

# Install some dependencies
RUN dpkg --add-architecture i386 && apt-get update \
    && apt-get install -y expect wget unzip \
    libc6-i386 lib32stdc++6 lib32gcc1 lib32ncurses5 lib32z1

# Install java
RUN apt-get install -y openjdk-8-jdk-headless

# Install the Android SDK
RUN cd /opt && wget --output-document=android-sdk.zip --quiet \
    https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip \
    && unzip android-sdk.zip -d /opt/android-sdk && rm -f android-sdk.zip
# Install graddle
RUN  cd /opt && wget --output-document=gradle.zip --quiet \
    https://services.gradle.org/distributions/gradle-5.2.1-bin.zip \
    && unzip gradle.zip -d /opt/gradle && rm -rf gradle.zip

# Setup environment
ENV GRADLE_HOME=/opt/gradle/gradle-5.2.1
ENV ANDROID_HOME /opt/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/build-tools/26.0.1:${ANDROID_HOME}/platform-tools:${GRADLE_HOME}/bin

# Install SDK elements. This might change depending on what your app needs
# I'm installing the most basic ones. You should modify this to install the ones
# you need. You can get a list of available elements by getting a shell to the
# container and using `sdkmanager --list`
RUN echo yes | sdkmanager "platform-tools" "platforms;android-26" "build-tools;26.0.1"

RUN ls ${ANDROID_HOME}/build-tools/26.0.1

FROM android as node

# Install Node.js
RUN apt-get install --yes curl gnupg2
RUN curl --silent --location https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential
RUN node -v && npm -v

FROM node as builder

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir -p /usr/src/app && cp -R ./node_modules /usr/src/app

WORKDIR /usr/src/app

COPY . .

## Add platform on separate layer
RUN npm run platforms

RUN npm run build-prod

FROM android as signer

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY --from=builder /usr/src/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./
COPY ./accord-release-key.keystore ./

RUN jarsigner -keypass password -storepass password -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore accord-release-key.keystore app-release-unsigned.apk accord-r-k

RUN zipalign -v 4 ./app-release-unsigned.apk accord.apk

CMD ["/bin/bash"]
