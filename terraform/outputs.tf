output "instance_name" {
  description = "Name of the compute instance"
  value       = module.compute.instance_name
}

output "instance_ip" {
  description = "External IP address of the instance"
  value       = module.network.static_ip_address
}

output "instance_internal_ip" {
  description = "Internal IP address of the instance"
  value       = module.compute.instance_internal_ip
}

output "network_name" {
  description = "Name of the VPC network"
  value       = module.network.network_name
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = module.network.subnet_name
}

output "static_ip_address" {
  description = "Static IP address"
  value       = module.network.static_ip_address
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "gcloud compute ssh ${module.compute.instance_name} --zone=${var.zone}"
}
