output "network_name" {
  description = "Name of the VPC network"
  value       = google_compute_network.vpc_network.name
}

output "network_id" {
  description = "ID of the VPC network"
  value       = google_compute_network.vpc_network.id
}

output "network_self_link" {
  description = "Self link of the VPC network"
  value       = google_compute_network.vpc_network.self_link
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = google_compute_subnetwork.subnet.name
}

output "subnet_id" {
  description = "ID of the subnet"
  value       = google_compute_subnetwork.subnet.id
}

output "static_ip_address" {
  description = "Static IP address"
  value       = google_compute_address.static_ip.address
}

output "static_ip_name" {
  description = "Name of the static IP"
  value       = google_compute_address.static_ip.name
}
