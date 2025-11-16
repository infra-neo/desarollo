variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "zone" {
  description = "GCP zone"
  type        = string
}

variable "instance_name" {
  description = "Name of the compute instance"
  type        = string
}

variable "machine_type" {
  description = "Machine type"
  type        = string
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
}

variable "network_name" {
  description = "Network name"
  type        = string
}

variable "subnet_name" {
  description = "Subnet name"
  type        = string
}

variable "static_ip" {
  description = "Static IP address"
  type        = string
}

variable "tags" {
  description = "Network tags"
  type        = list(string)
}

variable "additional_disks" {
  description = "Additional persistent disks"
  type = list(object({
    name       = string
    size_gb    = number
    type       = string
    mount_path = string
  }))
  default = []
}

variable "tailscale_authkey" {
  description = "Tailscale authentication key"
  type        = string
  sensitive   = true
}

variable "startup_script_path" {
  description = "Path to startup script template"
  type        = string
}
