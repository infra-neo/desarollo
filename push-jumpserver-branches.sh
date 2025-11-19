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
if git push origin jumpserver-installer:jumpserver-installer 2>&1; then
    echo "✓ jumpserver-installer pushed successfully"
    INSTALLER_PUSHED=true
else
    echo "⚠ Note: If authentication failed, you may need to configure git credentials"
    echo "  Try: gh auth login"
    echo "  Or set up a personal access token"
    INSTALLER_PUSHED=false
fi

echo ""

# Push jumpserver-client branch
echo "Pushing jumpserver-client branch..."
if git push origin jumpserver-client:jumpserver-client 2>&1; then
    echo "✓ jumpserver-client pushed successfully"
    CLIENT_PUSHED=true
else
    echo "⚠ Note: If authentication failed, you may need to configure git credentials"
    CLIENT_PUSHED=false
fi

echo ""
echo "======================================"
if [ "$INSTALLER_PUSHED" = true ] && [ "$CLIENT_PUSHED" = true ]; then
    echo "✅ All branches pushed successfully!"
else
    echo "⚠️  Branch push incomplete"
    echo ""
    echo "Branches exist locally but need authentication to push remotely."
    echo ""
    echo "Alternative methods:"
    echo "1. Using GitHub CLI:"
    echo "   gh auth login"
    echo "   git push origin --all"
    echo ""
    echo "2. Using git with personal access token:"
    echo "   git remote set-url origin https://YOUR_TOKEN@github.com/infra-neo/desarollo.git"
    echo "   git push origin --all"
    echo ""
    echo "3. Push via GitHub web interface:"
    echo "   - Create the branches via GitHub UI"
    echo "   - Push the local branches"
fi
echo "======================================"
echo ""
echo "Verify with: git branch -a | grep jumpserver"
echo ""
