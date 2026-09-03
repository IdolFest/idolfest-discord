#! /usr/bin/env bash

DEPLOY_PATH=/srv/nw-idolfest-discord

pushd $DEPLOY_PATH
git pull origin main
npm install
sudo systemctl restart nw-idolfest-discord.service
popd;