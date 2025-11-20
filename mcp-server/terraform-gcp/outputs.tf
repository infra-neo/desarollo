# Network Outputs
output "vpc_network_id" {
  description = "VPC network ID"
  value       = google_compute_network.mcp_network.id
}

output "vpc_network_name" {
  description = "VPC network name"
  value       = google_compute_network.mcp_network.name
}

output "subnet_id" {
  description = "Subnet ID"
  value       = google_compute_subnetwork.mcp_subnet.id
}

output "subnet_cidr" {
  description = "Subnet CIDR range"
  value       = google_compute_subnetwork.mcp_subnet.ip_cidr_range
}

# Compute Outputs
output "instance_id" {
  description = "Instance ID"
  value       = google_compute_instance.mcp_server.id
}

output "instance_name" {
  description = "Instance name"
  value       = google_compute_instance.mcp_server.name
}

output "instance_internal_ip" {
  description = "Instance internal IP address"
  value       = google_compute_instance.mcp_server.network_interface[0].network_ip
}

output "instance_external_ip" {
  description = "Instance external IP address"
  value       = google_compute_address.mcp_static_ip.address
}

# Service Account
output "service_account_email" {
  description = "Service account email"
  value       = google_service_account.mcp_sa.email
}

# DNS Outputs
output "dns_zone_name" {
  description = "DNS zone name"
  value       = var.create_dns_zone ? google_dns_managed_zone.mcp_zone[0].name : null
}

output "dns_name_servers" {
  description = "DNS name servers"
  value       = var.create_dns_zone ? google_dns_managed_zone.mcp_zone[0].name_servers : null
}

# Connection Information
output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh ${var.ssh_user}@${google_compute_address.mcp_static_ip.address}"
}

output "application_urls" {
  description = "Application URLs"
  value = {
    authentik  = "https://auth.${var.domain}"
    jumpserver = "https://jump.${var.domain}"
    infisical  = "https://vault.${var.domain}"
    webasset   = "https://web.${var.domain}"
    panel      = "https://panel.${var.domain}"
    traefik    = "https://traefik.${var.domain}"
  }
}

# Summary
output "deployment_summary" {
  description = "Deployment summary"
  value = <<-EOT
    ============================================
    MCP Server Deployment Summary
    ============================================
    
    Instance:
      Name: ${google_compute_instance.mcp_server.name}
      Type: ${var.machine_type}
      Zone: ${var.zone}
      External IP: ${google_compute_address.mcp_static_ip.address}
      Internal IP: ${google_compute_instance.mcp_server.network_interface[0].network_ip}
    
    SSH Connection:
      ssh ${var.ssh_user}@${google_compute_address.mcp_static_ip.address}
    
    Application URLs:
      Authentik:  https://auth.${var.domain}
      JumpServer: https://jump.${var.domain}
      Infisical:  https://vault.${var.domain}
      WebAsset:   https://web.${var.domain}
      1Panel:     https://panel.${var.domain}
      Traefik:    https://traefik.${var.domain}
    
    Next Steps:
      1. SSH into the instance
      2. Navigate to /opt/mcp-server
      3. Configure .env file
      4. Run: docker-compose up -d
      5. Run: ./scripts/init.sh
    
    ============================================
  EOT
}
