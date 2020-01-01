#!/bin/sh
echo "Compiling Typescript..."
cd lambda/custom && npm run-script build

echo "Building application..."
cp package.json dist && cd dist && npm install --production

echo "Deploying skill..."
cd .. && cd .. && cd .. && ask deploy
