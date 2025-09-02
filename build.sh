#!/bin/bash

echo "Building LRC Audio Timing..."
echo

echo "Installing dependencies..."
npm install

echo
echo "Building executable..."
npm run build

echo
echo "Build complete! Check the 'dist' folder for your executable."
