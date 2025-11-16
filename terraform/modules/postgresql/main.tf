# PostgreSQL Database Module
# Unified PostgreSQL instance with multiple databases for the stack
# Author: Ing. Benjamín Frías — DevOps & Cloud Specialist

resource "google_sql_database_instance" "postgres" {
  name             = var.instance_name
  database_version = var.database_version
  region           = var.region
  project          = var.project_id

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_type         = var.disk_type
    disk_size         = var.disk_size

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
      }
    }

    ip_configuration {
      ipv4_enabled    = var.public_ip_enabled
      private_network = var.vpc_network_id
      ssl_mode        = "ENCRYPTED_ONLY"

      dynamic "authorized_networks" {
        for_each = var.authorized_networks
        content {
          name  = authorized_networks.value.name
          value = authorized_networks.value.cidr
        }
      }
    }

    database_flags {
      name  = "max_connections"
      value = var.max_connections
    }

    database_flags {
      name  = "shared_buffers"
      value = "256000"
    }

    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }
  }

  deletion_protection = var.deletion_protection

  depends_on = [var.vpc_network_id]
}

# Root user password
resource "random_password" "root_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "root" {
  name     = "postgres"
  instance = google_sql_database_instance.postgres.name
  password = random_password.root_password.result
}

# Authentik Database
resource "google_sql_database" "authentik" {
  name     = var.db_authentik_name
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

resource "random_password" "authentik_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "authentik" {
  name     = var.db_authentik_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.authentik_password.result
}

# JumpServer Database
resource "google_sql_database" "jumpserver" {
  name     = var.db_jumpserver_name
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

resource "random_password" "jumpserver_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "jumpserver" {
  name     = var.db_jumpserver_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.jumpserver_password.result
}

# Infisical Database
resource "google_sql_database" "infisical" {
  name     = var.db_infisical_name
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

resource "random_password" "infisical_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "infisical" {
  name     = var.db_infisical_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.infisical_password.result
}

# 1Panel Database
resource "google_sql_database" "onepanel" {
  name     = var.db_onepanel_name
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

resource "random_password" "onepanel_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "onepanel" {
  name     = var.db_onepanel_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.onepanel_password.result
}

# WebAsset Controller Database
resource "google_sql_database" "webasset" {
  name     = var.db_webasset_name
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
}

resource "random_password" "webasset_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "webasset" {
  name     = var.db_webasset_user
  instance = google_sql_database_instance.postgres.name
  password = random_password.webasset_password.result
}
