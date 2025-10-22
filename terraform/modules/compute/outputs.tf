output "instance_name" {
  description = "Name of the instance"
  value       = google_compute_instance.vm_instance.name
}

output "instance_id" {
  description = "ID of the instance"
  value       = google_compute_instance.vm_instance.id
}

output "instance_internal_ip" {
  description = "Internal IP address"
  value       = google_compute_instance.vm_instance.network_interface[0].network_ip
}

output "instance_self_link" {
  description = "Self link of the instance"
  value       = google_compute_instance.vm_instance.self_link
}
