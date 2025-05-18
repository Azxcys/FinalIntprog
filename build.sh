#!/bin/bash
npm install
chmod +x node_modules/.bin/react-scripts
export NODE_OPTIONS=--openssl-legacy-provider
CI=false ./node_modules/.bin/react-scripts build 