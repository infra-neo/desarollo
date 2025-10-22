variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "zone" {
  description = "GCP Zone"
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
  default     = []
}

variable "ssh_user" {
  description = "SSH user for the instance"
  type        = string
  default     = "ubuntu"
}

variable "ssh_public_key" {
  description = "SSH public key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
