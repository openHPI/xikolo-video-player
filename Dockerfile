FROM node:16@sha256:c33a8221330d87a2113fb6cdbb8fbb243592c62f89de923e9ef5bb8b627c2b9d

# https://github.com/GoogleChrome/puppeteer/blob/master/.ci/node12/Dockerfile.linux
RUN apt-get update \
    && apt-get -y install xvfb gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libgbm1 \
      libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
      libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
      libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
      libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    && rm -rf /var/lib/apt/lists/*

# Own tools
RUN apt-get update \
    && apt-get -y install sudo \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash user \
    && mkdir -p /home/user/.npm/lib \
    && chown -R user:user /home/user \
    && echo "user ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/user \
    && chmod 0440 /etc/sudoers.d/user

USER user
