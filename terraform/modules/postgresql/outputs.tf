output "instance_name" {
  description = "Name of the PostgreSQL instance"
  value       = google_sql_database_instance.postgres.name
}

output "instance_connection_name" {
  description = "Connection name for the PostgreSQL instance"
  value       = google_sql_database_instance.postgres.connection_name
}

output "private_ip_address" {
  description = "Private IP address of the PostgreSQL instance"
  value       = google_sql_database_instance.postgres.private_ip_address
}

output "public_ip_address" {
  description = "Public IP address of the PostgreSQL instance"
  value       = google_sql_database_instance.postgres.public_ip_address
}

# Root credentials
output "root_user" {
  description = "Root database user"
  value       = google_sql_user.root.name
}

output "root_password" {
  description = "Root database password"
  value       = random_password.root_password.result
  sensitive   = true
}

# Authentik database outputs
output "authentik_db_name" {
  description = "Authentik database name"
  value       = google_sql_database.authentik.name
}

output "authentik_db_user" {
  description = "Authentik database user"
  value       = google_sql_user.authentik.name
}

output "authentik_db_password" {
  description = "Authentik database password"
  value       = random_password.authentik_password.result
  sensitive   = true
}

output "authentik_connection_string" {
  description = "Authentik database connection string"
  value       = "postgresql://${google_sql_user.authentik.name}:${random_password.authentik_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.authentik.name}"
  sensitive   = true
}

# JumpServer database outputs
output "jumpserver_db_name" {
  description = "JumpServer database name"
  value       = google_sql_database.jumpserver.name
}

output "jumpserver_db_user" {
  description = "JumpServer database user"
  value       = google_sql_user.jumpserver.name
}

output "jumpserver_db_password" {
  description = "JumpServer database password"
  value       = random_password.jumpserver_password.result
  sensitive   = true
}

output "jumpserver_connection_string" {
  description = "JumpServer database connection string"
  value       = "postgresql://${google_sql_user.jumpserver.name}:${random_password.jumpserver_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.jumpserver.name}"
  sensitive   = true
}

# Infisical database outputs
output "infisical_db_name" {
  description = "Infisical database name"
  value       = google_sql_database.infisical.name
}

output "infisical_db_user" {
  description = "Infisical database user"
  value       = google_sql_user.infisical.name
}

output "infisical_db_password" {
  description = "Infisical database password"
  value       = random_password.infisical_password.result
  sensitive   = true
}

output "infisical_connection_string" {
  description = "Infisical database connection string"
  value       = "postgresql://${google_sql_user.infisical.name}:${random_password.infisical_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.infisical.name}"
  sensitive   = true
}

# 1Panel database outputs
output "onepanel_db_name" {
  description = "1Panel database name"
  value       = google_sql_database.onepanel.name
}

output "onepanel_db_user" {
  description = "1Panel database user"
  value       = google_sql_user.onepanel.name
}

output "onepanel_db_password" {
  description = "1Panel database password"
  value       = random_password.onepanel_password.result
  sensitive   = true
}

output "onepanel_connection_string" {
  description = "1Panel database connection string"
  value       = "postgresql://${google_sql_user.onepanel.name}:${random_password.onepanel_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.onepanel.name}"
  sensitive   = true
}

# WebAsset database outputs
output "webasset_db_name" {
  description = "WebAsset Controller database name"
  value       = google_sql_database.webasset.name
}

output "webasset_db_user" {
  description = "WebAsset Controller database user"
  value       = google_sql_user.webasset.name
}

output "webasset_db_password" {
  description = "WebAsset Controller database password"
  value       = random_password.webasset_password.result
  sensitive   = true
}

output "webasset_connection_string" {
  description = "WebAsset Controller database connection string"
  value       = "postgresql://${google_sql_user.webasset.name}:${random_password.webasset_password.result}@${google_sql_database_instance.postgres.private_ip_address}:5432/${google_sql_database.webasset.name}"
  sensitive   = true
}
