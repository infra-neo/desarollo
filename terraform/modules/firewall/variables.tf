variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
}

variable "network_tags" {
  description = "Network tags to apply firewall rules to"
  type        = list(string)
  default     = []
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
  description = "Source IP ranges for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allow_swarm" {
  description = "Allow Docker Swarm traffic"
  type        = bool
  default     = true
}

variable "allow_observability" {
  description = "Allow observability stack traffic"
  type        = bool
  default     = true
}

variable "observability_source_ranges" {
  description = "Source IP ranges for observability access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
