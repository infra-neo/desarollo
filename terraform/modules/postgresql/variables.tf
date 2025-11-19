variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region for the database instance"
  type        = string
  default     = "us-central1"
}

variable "instance_name" {
  description = "Name of the PostgreSQL instance"
  type        = string
  default     = "desarollo-postgres"
}

variable "database_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "POSTGRES_15"
}

variable "tier" {
  description = "Machine tier for the database"
  type        = string
  default     = "db-g1-small"
}

variable "availability_type" {
  description = "Availability type (ZONAL or REGIONAL)"
  type        = string
  default     = "ZONAL"
}

variable "disk_type" {
  description = "Disk type (PD_SSD or PD_HDD)"
  type        = string
  default     = "PD_SSD"
}

variable "disk_size" {
  description = "Disk size in GB"
  type        = number
  default     = 20
}

variable "public_ip_enabled" {
  description = "Enable public IP for the instance"
  type        = bool
  default     = false
}

variable "vpc_network_id" {
  description = "VPC network ID for private IP"
  type        = string
}

variable "authorized_networks" {
  description = "List of authorized networks"
  type = list(object({
    name = string
    cidr = string
  }))
  default = []
}

variable "max_connections" {
  description = "Maximum number of connections"
  type        = string
  default     = "100"
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

# Database names
variable "db_authentik_name" {
  description = "Authentik database name"
  type        = string
  default     = "authentik"
}

variable "db_authentik_user" {
  description = "Authentik database user"
  type        = string
  default     = "authentik"
}

variable "db_jumpserver_name" {
  description = "JumpServer database name"
  type        = string
  default     = "jumpserver"
}

variable "db_jumpserver_user" {
  description = "JumpServer database user"
  type        = string
  default     = "jumpserver"
}

variable "db_infisical_name" {
  description = "Infisical database name"
  type        = string
  default     = "infisical"
}

variable "db_infisical_user" {
  description = "Infisical database user"
  type        = string
  default     = "infisical"
}

variable "db_onepanel_name" {
  description = "1Panel database name"
  type        = string
  default     = "onepanel"
}

variable "db_onepanel_user" {
  description = "1Panel database user"
  type        = string
  default     = "onepanel"
}

variable "db_webasset_name" {
  description = "WebAsset Controller database name"
  type        = string
  default     = "webasset"
}

variable "db_webasset_user" {
  description = "WebAsset Controller database user"
  type        = string
  default     = "webasset"
}
