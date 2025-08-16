#!/bin/bash

# Setup script to configure git hooks for the project

echo "Setting up git hooks..."

# Configure git to use the .githooks directory
git config core.hooksPath .githooks

echo "✓ Git hooks configured successfully!"
echo "  Pre-commit hook will now remind you to update GIT_HISTORY.md"