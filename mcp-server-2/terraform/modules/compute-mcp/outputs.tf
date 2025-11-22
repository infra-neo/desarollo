output "instance_name" {
  description = "Name of the compute instance"
  value       = google_compute_instance.instance.name
}

output "instance_id" {
  description = "ID of the compute instance"
  value       = google_compute_instance.instance.id
}

output "instance_self_link" {
  description = "Self link of the instance"
  value       = google_compute_instance.instance.self_link
}
