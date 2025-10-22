output "http_firewall_rule" {
  description = "HTTP firewall rule name"
  value       = var.allow_http ? google_compute_firewall.allow_http[0].name : null
}

output "https_firewall_rule" {
  description = "HTTPS firewall rule name"
  value       = var.allow_https ? google_compute_firewall.allow_https[0].name : null
}

output "ssh_firewall_rule" {
  description = "SSH firewall rule name"
  value       = var.allow_ssh ? google_compute_firewall.allow_ssh[0].name : null
}

output "swarm_tcp_firewall_rule" {
  description = "Docker Swarm TCP firewall rule name"
  value       = var.allow_swarm ? google_compute_firewall.allow_swarm_tcp[0].name : null
}

output "swarm_udp_firewall_rule" {
  description = "Docker Swarm UDP firewall rule name"
  value       = var.allow_swarm ? google_compute_firewall.allow_swarm_udp[0].name : null
}
