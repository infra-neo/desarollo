# Infrastructure Diagrams

This directory contains tools and generated diagrams for the infrastructure.

## Overview

The diagram generation tools automatically create visual representations of the Terraform infrastructure using:
- **Inframap**: Generates diagrams from Terraform state
- **Terravision**: Creates architectural diagrams from Terraform code

All diagrams include the branding footer: **"Ing. Benjamín Frías — DevOps & Cloud Specialist"**

## Usage

### Generate Diagrams

Run the diagram generation script:

```bash
./generate-diagrams.sh
```

This will:
1. Generate infrastructure diagrams using Inframap
2. Generate architecture diagrams using Terravision
3. Add branding footer to all generated diagrams
4. Save outputs to `diagrams/output/`

### Requirements

- Docker installed and running
- Terraform configuration in `../terraform/` directory

## Generated Files

The script generates the following diagrams:

- `infrastructure-inframap.png` - Infrastructure diagram from Terraform state
- `infrastructure-terravision.png` - Architecture diagram from Terraform code
- `branded-*.png` - Diagrams with branding footer

## Automation

The diagram generation is integrated into the CI/CD pipeline and runs automatically on:
- Infrastructure changes
- Manual workflow dispatch

## Customization

To customize the diagrams:

1. **Inframap**: Modify Terraform resources and tags
2. **Terravision**: Adjust Terraform module structure
3. **Branding**: Edit the footer text in `generate-diagrams.sh`

## Author

**Ing. Benjamín Frías — DevOps & Cloud Specialist**
