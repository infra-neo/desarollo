# Project Configuration
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}

# Network Configuration
variable "network_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "mcp-server-2-network"
}

variable "subnet_name" {
  description = "Name of the subnet"
  type        = string
  default     = "mcp-server-2-subnet"
}

variable "subnet_cidr" {
  description = "CIDR range for the subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "static_ip_name" {
  description = "Name of the static IP"
  type        = string
  default     = "mcp-server-2-ip"
}

# Compute Configuration
variable "instance_name" {
  description = "Name of the compute instance"
  type        = string
  default     = "mcp-server-2"
}

variable "machine_type" {
  description = "Machine type for the instance"
  type        = string
  default     = "e2-standard-4"  # 4 vCPUs, 16 GB RAM
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 100
}

variable "additional_disks" {
  description = "Additional persistent disks for data"
  type = list(object({
    name      = string
    size_gb   = number
    type      = string
    mount_path = string
  }))
  default = [
    {
      name       = "mcp-data-disk"
      size_gb    = 200
      type       = "pd-standard"
      mount_path = "/mnt/mcp-data"
    },
    {
      name       = "mcp-recordings-disk"
      size_gb    = 500
      type       = "pd-standard"
      mount_path = "/mnt/mcp-recordings"
    }
  ]
}

# Network Tags
variable "network_tags" {
  description = "Network tags for firewall rules"
  type        = list(string)
  default     = ["mcp-server-2", "web-server", "zero-trust"]
}

# Tailscale Configuration
variable "tailscale_authkey" {
  description = "Tailscale authentication key"
  type        = string
  sensitive   = true
}

# Environment Variables for Docker Compose
variable "domain" {
  description = "Domain name for the services"
  type        = string
}

variable "acme_email" {
  description = "Email for Let's Encrypt certificates"
  type        = string
}

variable "postgres_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive   = true
}

variable "authentik_secret_key" {
  description = "Authentik secret key (min 50 chars)"
  type        = string
  sensitive   = true
}

variable "kasm_admin_password" {
  description = "Kasm administrator password"
  type        = string
  sensitive   = true
}

variable "infisical_encryption_key" {
  description = "Infisical encryption key (32 chars)"
  type        = string
  sensitive   = true
}
