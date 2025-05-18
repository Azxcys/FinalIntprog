#!/bin/bash
set -e  # Exit on error

# Ensure script is executable
chmod +x "$0"

# Install dependencies
echo "Installing dependencies..."
npm install

# Set permissions for react-scripts
echo "Setting permissions for react-scripts..."
chmod +x ./node_modules/.bin/react-scripts
chmod +x ./node_modules/.bin/*

# Set Node options for legacy OpenSSL if needed
export NODE_OPTIONS=--openssl-legacy-provider

# Build the application
echo "Building the application..."
CI=false ./node_modules/.bin/react-scripts build

echo "Build completed successfully!" 