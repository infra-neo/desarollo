terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Uncomment for remote state storage
  # backend "gcs" {
  #   bucket = "desarollo-terraform-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Compute Instance
module "compute" {
  source = "./modules/compute"

  project_id    = var.project_id
  zone          = var.zone
  instance_name = var.instance_name
  machine_type  = var.machine_type
  disk_size_gb  = var.disk_size_gb
  network_name  = module.network.network_name
  subnet_name   = module.network.subnet_name
  static_ip     = module.network.static_ip_address

  tags = var.network_tags
}

# Network Configuration
module "network" {
  source = "./modules/network"

  project_id     = var.project_id
  region         = var.region
  network_name   = var.network_name
  subnet_name    = var.subnet_name
  subnet_cidr    = var.subnet_cidr
  static_ip_name = var.static_ip_name
}

# Firewall Rules
module "firewall" {
  source = "./modules/firewall"

  project_id   = var.project_id
  network_name = module.network.network_name

  allow_http  = true
  allow_https = true
  allow_ssh   = true
  allow_swarm = true

  network_tags = var.network_tags
}
