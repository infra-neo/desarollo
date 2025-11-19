#!/bin/bash
# Script to push the newly created jumpserver branches to remote
# This script should be run with appropriate GitHub credentials

set -e

echo "======================================"
echo "Pushing Jumpserver Branches to Remote"
echo "======================================"
echo ""

# Check if we're in the correct repository
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Verify branches exist locally
echo "Checking for local branches..."
if git branch | grep -q "jumpserver-installer"; then
    echo "✓ jumpserver-installer branch exists"
else
    echo "✗ jumpserver-installer branch not found"
    exit 1
fi

if git branch | grep -q "jumpserver-client"; then
    echo "✓ jumpserver-client branch exists"
else
    echo "✗ jumpserver-client branch not found"
    exit 1
fi

echo ""
echo "Pushing branches to remote..."
echo ""

# Push jumpserver-installer branch
echo "Pushing jumpserver-installer branch..."
if git push origin jumpserver-installer:jumpserver-installer; then
    echo "✓ jumpserver-installer pushed successfully"
else
    echo "✗ Failed to push jumpserver-installer"
    exit 1
fi

echo ""

# Push jumpserver-client branch
echo "Pushing jumpserver-client branch..."
if git push origin jumpserver-client:jumpserver-client; then
    echo "✓ jumpserver-client pushed successfully"
else
    echo "✗ Failed to push jumpserver-client"
    exit 1
fi

echo ""
echo "======================================"
echo "All branches pushed successfully!"
echo "======================================"
echo ""
echo "Verify with: git branch -a | grep jumpserver"
echo ""
