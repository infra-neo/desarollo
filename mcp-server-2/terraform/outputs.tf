output "instance_name" {
  description = "Name of the compute instance"
  value       = module.compute.instance_name
}

output "instance_id" {
  description = "ID of the compute instance"
  value       = module.compute.instance_id
}

output "static_ip" {
  description = "Static external IP address"
  value       = module.network.static_ip_address
}

output "network_name" {
  description = "Name of the VPC network"
  value       = module.network.network_name
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = module.network.subnet_name
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "gcloud compute ssh ${module.compute.instance_name} --zone=${var.zone} --project=${var.project_id}"
}

output "service_urls" {
  description = "URLs for accessing services"
  value = {
    authentik     = "https://auth.${var.domain}"
    kasm          = "https://kasm.${var.domain}"
    infisical     = "https://vault.${var.domain}"
    onepanel      = "https://panel.${var.domain}"
    webasset      = "https://web.${var.domain}"
    traefik       = "https://traefik.${var.domain}"
  }
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    project_id    = var.project_id
    region        = var.region
    zone          = var.zone
    instance_name = var.instance_name
    machine_type  = var.machine_type
    network       = var.network_name
  }
}
