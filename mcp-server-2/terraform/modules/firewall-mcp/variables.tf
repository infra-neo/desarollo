variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
}

variable "allow_http" {
  description = "Allow HTTP traffic"
  type        = bool
  default     = true
}

variable "allow_https" {
  description = "Allow HTTPS traffic"
  type        = bool
  default     = true
}

variable "allow_ssh" {
  description = "Allow SSH traffic"
  type        = bool
  default     = true
}

variable "ssh_source_ranges" {
  description = "Source IP ranges allowed for SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # In production, restrict this to specific IPs
}

variable "network_tags" {
  description = "Network tags for firewall rules"
  type        = list(string)
}
