#!/bin/bash
set -e

# Docker Stack Removal Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

STACK_NAME="${1:-desarollo}"

echo "=== Docker Stack Removal ==="
echo "Stack name: $STACK_NAME"

# Check if Docker Swarm is active
if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
    echo "Error: Docker Swarm is not active."
    exit 1
fi

# Check if stack exists
if ! docker stack ls | grep -q "$STACK_NAME"; then
    echo "Stack '$STACK_NAME' not found"
    exit 0
fi

# Remove the stack
echo "Removing stack..."
docker stack rm "$STACK_NAME"

if [ $? -eq 0 ]; then
    echo "✓ Stack removed successfully"
    
    # Wait for cleanup
    echo "Waiting for cleanup..."
    sleep 5
    
    echo ""
    echo "Remaining stacks:"
    docker stack ls
else
    echo "Error: Failed to remove stack"
    exit 1
fi
