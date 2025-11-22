terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Optional: Use GCS backend for state storage
  # backend "gcs" {
  #   bucket = "mcp-server-2-terraform-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Network Module
module "network" {
  source = "./modules/network-mcp"

  project_id     = var.project_id
  region         = var.region
  network_name   = var.network_name
  subnet_name    = var.subnet_name
  subnet_cidr    = var.subnet_cidr
  static_ip_name = var.static_ip_name
}

# Firewall Module
module "firewall" {
  source = "./modules/firewall-mcp"

  project_id   = var.project_id
  network_name = module.network.network_name

  # Only expose HTTP and HTTPS for Traefik
  allow_http  = true
  allow_https = true
  allow_ssh   = true

  network_tags = var.network_tags
}

# Compute Module - Enhanced for MCP Server 2
module "compute" {
  source = "./modules/compute-mcp"

  project_id    = var.project_id
  zone          = var.zone
  instance_name = var.instance_name
  machine_type  = var.machine_type
  disk_size_gb  = var.disk_size_gb
  network_name  = module.network.network_name
  subnet_name   = module.network.subnet_name
  static_ip     = module.network.static_ip_address

  # Additional disks for data persistence
  additional_disks = var.additional_disks

  # Tailscale configuration
  tailscale_authkey = var.tailscale_authkey

  # Startup script path
  startup_script_path = "${path.module}/scripts/startup.sh"

  tags = var.network_tags
}
