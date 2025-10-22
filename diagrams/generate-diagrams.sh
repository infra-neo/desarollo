#!/bin/bash
set -e

# Infrastructure Diagram Generation Script
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

echo "=== Infrastructure Diagram Generation ==="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/../terraform"
OUTPUT_DIR="$SCRIPT_DIR/output"

mkdir -p "$OUTPUT_DIR"

echo "Output directory: $OUTPUT_DIR"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Generate diagram using Inframap
echo ""
echo "Generating Terraform infrastructure diagram with Inframap..."
if [ -d "$TERRAFORM_DIR" ]; then
    docker run --rm -v "$TERRAFORM_DIR:/terraform" cycloid/inframap generate /terraform | \
        docker run --rm -i cycloid/inframap prune --canonicalize | \
        docker run --rm -i nshine/dot dot -Tpng > "$OUTPUT_DIR/infrastructure-inframap.png"
    
    if [ -f "$OUTPUT_DIR/infrastructure-inframap.png" ]; then
        echo "✓ Inframap diagram generated: $OUTPUT_DIR/infrastructure-inframap.png"
    fi
else
    echo "Warning: Terraform directory not found at $TERRAFORM_DIR"
fi

# Generate diagram using Terravision
echo ""
echo "Generating Terraform infrastructure diagram with Terravision..."
if [ -d "$TERRAFORM_DIR" ]; then
    docker run --rm -v "$TERRAFORM_DIR:/terraform" -v "$OUTPUT_DIR:/output" \
        patrickchugh/terravision:latest \
        -source /terraform -o /output/infrastructure-terravision.png
    
    if [ -f "$OUTPUT_DIR/infrastructure-terravision.png" ]; then
        echo "✓ Terravision diagram generated: $OUTPUT_DIR/infrastructure-terravision.png"
    fi
else
    echo "Warning: Terraform directory not found"
fi

# Add branding footer to diagrams
echo ""
echo "Adding branding footer to diagrams..."
for diagram in "$OUTPUT_DIR"/*.png; do
    if [ -f "$diagram" ]; then
        docker run --rm -v "$OUTPUT_DIR:/images" dpokidov/imagemagick:latest \
            convert "/images/$(basename "$diagram")" \
            -gravity South -pointsize 14 -fill white -annotate +0+5 \
            "Ing. Benjamín Frías — DevOps & Cloud Specialist" \
            "/images/branded-$(basename "$diagram")"
        
        echo "✓ Branded diagram created: $OUTPUT_DIR/branded-$(basename "$diagram")"
    fi
done

echo ""
echo "=== Diagram Generation Complete ==="
echo "Generated diagrams are available in: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"
