#!/bin/bash

# Build script for Vercel deployment
set -e

echo "Building Singularity News for deployment..."

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build shared package first
echo "Building shared package..."
cd shared
pnpm build
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
pnpm build:vercel
cd ..

echo "Build completed successfully!"