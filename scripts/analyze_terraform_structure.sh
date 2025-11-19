#!/bin/bash

# Terraform Structure Analyzer
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
# Description: Analyzes and documents the current Terraform infrastructure

set -e

TERRAFORM_DIR="${1:-./terraform}"
OUTPUT_FILE="${2:-./terraform_structure.md}"

echo "🔍 Analyzing Terraform structure in: $TERRAFORM_DIR"
echo "📄 Output will be saved to: $OUTPUT_FILE"

# Initialize output file
cat > "$OUTPUT_FILE" << 'EOF'
# Terraform Infrastructure Structure Analysis

**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Author:** Ing. Benjamín Frías — DevOps & Cloud Specialist

---

## Overview

This document provides a comprehensive analysis of the current Terraform infrastructure,
including all providers, modules, variables, outputs, and resources.

---

EOF

# Add timestamp
sed -i "s/\*\*Generated:\*\* \$(date.*)/$(date -u +"**Generated:** %Y-%m-%d %H:%M:%S UTC")/" "$OUTPUT_FILE"

# Function to analyze providers
analyze_providers() {
    echo "## Providers" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -f "$TERRAFORM_DIR/main.tf" ]; then
        echo "### Configured Providers" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo '```hcl' >> "$OUTPUT_FILE"
        grep -A 10 "required_providers" "$TERRAFORM_DIR/main.tf" | head -20 >> "$OUTPUT_FILE" || echo "# No providers found" >> "$OUTPUT_FILE"
        echo '```' >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Function to analyze modules
analyze_modules() {
    echo "## Modules" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -d "$TERRAFORM_DIR/modules" ]; then
        echo "### Available Modules" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        for module_dir in "$TERRAFORM_DIR/modules"/*; do
            if [ -d "$module_dir" ]; then
                module_name=$(basename "$module_dir")
                echo "#### Module: \`$module_name\`" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                # Module description from comments
                if [ -f "$module_dir/main.tf" ]; then
                    desc=$(head -5 "$module_dir/main.tf" | grep -E "^#|^//" | sed 's/^# //;s/^\/\/ //' || echo "No description available")
                    echo "$desc" >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                fi
                
                # Count resources
                if [ -f "$module_dir/main.tf" ]; then
                    resource_count=$(grep -c "^resource" "$module_dir/main.tf" || echo "0")
                    echo "- **Resources:** $resource_count" >> "$OUTPUT_FILE"
                fi
                
                # List variables
                if [ -f "$module_dir/variables.tf" ]; then
                    var_count=$(grep -c "^variable" "$module_dir/variables.tf" || echo "0")
                    echo "- **Variables:** $var_count" >> "$OUTPUT_FILE"
                fi
                
                # List outputs
                if [ -f "$module_dir/outputs.tf" ]; then
                    output_count=$(grep -c "^output" "$module_dir/outputs.tf" || echo "0")
                    echo "- **Outputs:** $output_count" >> "$OUTPUT_FILE"
                fi
                
                echo "" >> "$OUTPUT_FILE"
            fi
        done
    else
        echo "No modules directory found." >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Function to analyze variables
analyze_variables() {
    echo "## Variables" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -f "$TERRAFORM_DIR/variables.tf" ]; then
        echo "### Root Variables" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "| Variable | Type | Default | Description |" >> "$OUTPUT_FILE"
        echo "|----------|------|---------|-------------|" >> "$OUTPUT_FILE"
        
        # Parse variables (simplified)
        awk '/^variable/ {
            var_name = $2
            gsub(/"/, "", var_name)
            description = ""
            type = ""
            default_val = ""
            
            while (getline) {
                if ($0 ~ /description/) {
                    match($0, /description[[:space:]]*=[[:space:]]*"([^"]*)"/, desc)
                    description = desc[1]
                }
                if ($0 ~ /type[[:space:]]*=/) {
                    match($0, /type[[:space:]]*=[[:space:]]*([[:alnum:]_]+)/, t)
                    type = t[1]
                }
                if ($0 ~ /default[[:space:]]*=/) {
                    match($0, /default[[:space:]]*=[[:space:]]*"?([^"]*)"?/, def)
                    default_val = def[1]
                    if (default_val == "") default_val = "(computed)"
                }
                if ($0 ~ /^}/) {
                    print "| `" var_name "` | " type " | " default_val " | " description " |"
                    break
                }
            }
        }' "$TERRAFORM_DIR/variables.tf" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Function to analyze outputs
analyze_outputs() {
    echo "## Outputs" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -f "$TERRAFORM_DIR/outputs.tf" ]; then
        echo "### Root Outputs" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "| Output | Description |" >> "$OUTPUT_FILE"
        echo "|--------|-------------|" >> "$OUTPUT_FILE"
        
        awk '/^output/ {
            output_name = $2
            gsub(/"/, "", output_name)
            description = ""
            
            while (getline) {
                if ($0 ~ /description/) {
                    match($0, /description[[:space:]]*=[[:space:]]*"([^"]*)"/, desc)
                    description = desc[1]
                }
                if ($0 ~ /^}/) {
                    print "| `" output_name "` | " description " |"
                    break
                }
            }
        }' "$TERRAFORM_DIR/outputs.tf" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Function to analyze resources
analyze_resources() {
    echo "## Resources" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    if [ -f "$TERRAFORM_DIR/main.tf" ]; then
        echo "### Resource Summary" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Count module calls
        module_count=$(grep -c "^module" "$TERRAFORM_DIR/main.tf" || echo "0")
        echo "- **Module Calls:** $module_count" >> "$OUTPUT_FILE"
        
        # List module calls
        if [ "$module_count" -gt 0 ]; then
            echo "" >> "$OUTPUT_FILE"
            echo "#### Module Instantiations" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            
            grep -A 1 "^module" "$TERRAFORM_DIR/main.tf" | grep -E "^module|source" | \
            awk 'BEGIN {mod=""} 
                 /^module/ {gsub(/"/, "", $2); mod=$2} 
                 /source/ {gsub(/"/, "", $3); print "- **" mod "**: " $3; mod=""}' >> "$OUTPUT_FILE"
        fi
        
        echo "" >> "$OUTPUT_FILE"
    fi
    
    # Analyze resources in modules
    if [ -d "$TERRAFORM_DIR/modules" ]; then
        echo "### Resources by Module" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        for module_dir in "$TERRAFORM_DIR/modules"/*; do
            if [ -d "$module_dir" ] && [ -f "$module_dir/main.tf" ]; then
                module_name=$(basename "$module_dir")
                echo "#### $module_name" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                # Extract resource types
                grep "^resource" "$module_dir/main.tf" | \
                awk '{gsub(/"/, "", $2); gsub(/"/, "", $3); print "- `" $2 "." $3 "`"}' >> "$OUTPUT_FILE"
                
                echo "" >> "$OUTPUT_FILE"
            fi
        done
    fi
}

# Function to create recommendations
create_recommendations() {
    echo "## Recommendations for Expansion" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "Based on the current structure, the following modules should be added:" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "### New Modules to Create" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "1. **PostgreSQL Module** - Unified database with multiple databases" >> "$OUTPUT_FILE"
    echo "   - authentik_db" >> "$OUTPUT_FILE"
    echo "   - jumpserver_db / kasm_db" >> "$OUTPUT_FILE"
    echo "   - infisical_db" >> "$OUTPUT_FILE"
    echo "   - panel_db" >> "$OUTPUT_FILE"
    echo "   - webasset_db" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "2. **Authentik Module** - Identity Provider" >> "$OUTPUT_FILE"
    echo "3. **Tailscale Module** - VPN + MagicDNS" >> "$OUTPUT_FILE"
    echo "4. **Traefik Module** - Reverse Proxy" >> "$OUTPUT_FILE"
    echo "5. **JumpServer/KasmWeb Module** - Session recording and audit" >> "$OUTPUT_FILE"
    echo "6. **Infisical Module** - Secrets management" >> "$OUTPUT_FILE"
    echo "7. **1Panel Module** - Server administration" >> "$OUTPUT_FILE"
    echo "8. **WebAsset Controller Module** - Banking automation controller" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "### Integration Strategy" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "- Use Terraform workspaces to avoid state conflicts" >> "$OUTPUT_FILE"
    echo "- Implement proper module dependencies via outputs/inputs" >> "$OUTPUT_FILE"
    echo "- Use data sources to reference existing resources" >> "$OUTPUT_FILE"
    echo "- Apply tagging strategy for resource organization" >> "$OUTPUT_FILE"
    echo "- Implement remote state storage (GCS recommended)" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Main execution
echo "📊 Analyzing providers..."
analyze_providers

echo "🔧 Analyzing modules..."
analyze_modules

echo "📝 Analyzing variables..."
analyze_variables

echo "📤 Analyzing outputs..."
analyze_outputs

echo "🏗️  Analyzing resources..."
analyze_resources

echo "💡 Creating recommendations..."
create_recommendations

# Add footer
cat >> "$OUTPUT_FILE" << 'EOF'

---

## Next Steps

1. Review this analysis document
2. Create new module directories under `terraform/modules/`
3. Implement each module with proper documentation
4. Update root `main.tf` to integrate new modules
5. Test with `terraform plan` before applying
6. Update CI/CD pipelines to include new validation steps

---

**Note:** This analysis is automatically generated. Review and validate before making infrastructure changes.

EOF

echo "✅ Analysis complete! Results saved to: $OUTPUT_FILE"
