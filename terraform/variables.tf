variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "us-central1-a"
}

variable "instance_name" {
  description = "Name of the compute instance"
  type        = string
  default     = "desarollo-vm"
}

variable "machine_type" {
  description = "Machine type for the compute instance"
  type        = string
  default     = "e2-medium"
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 50
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "desarollo-vpc"
}

variable "subnet_name" {
  description = "Name of the subnet"
  type        = string
  default     = "desarollo-subnet"
}

variable "subnet_cidr" {
  description = "CIDR range for the subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "static_ip_name" {
  description = "Name of the static IP"
  type        = string
  default     = "desarollo-static-ip"
}

variable "network_tags" {
  description = "Network tags for firewall rules"
  type        = list(string)
  default     = ["desarollo-vm", "http-server", "https-server"]
}
