# Compute instance for MCP Server 2

# Additional persistent disks
resource "google_compute_disk" "additional_disks" {
  for_each = { for disk in var.additional_disks : disk.name => disk }

  name    = each.value.name
  type    = each.value.type
  zone    = var.zone
  size    = each.value.size_gb
  project = var.project_id

  labels = {
    environment = "production"
    managed_by  = "terraform"
    purpose     = "mcp-server-2-data"
  }
}

# Compute instance
resource "google_compute_instance" "instance" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone
  project      = var.project_id

  tags = var.tags

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = var.disk_size_gb
      type  = "pd-ssd"
    }
  }

  # Attach additional disks
  dynamic "attached_disk" {
    for_each = google_compute_disk.additional_disks

    content {
      source      = attached_disk.value.id
      device_name = attached_disk.value.name
      mode        = "READ_WRITE"
    }
  }

  network_interface {
    network    = var.network_name
    subnetwork = var.subnet_name

    access_config {
      nat_ip = var.static_ip
    }
  }

  # Metadata
  metadata = {
    enable-oslogin = "TRUE"
    user-data      = templatefile(var.startup_script_path, {
      tailscale_authkey = var.tailscale_authkey
      additional_disks  = var.additional_disks
    })
  }

  # Service account with minimal permissions
  service_account {
    scopes = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring.write",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
    ]
  }

  # Allow stopping for updates
  allow_stopping_for_update = true

  # Scheduling
  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
  }

  labels = {
    environment = "production"
    managed_by  = "terraform"
    purpose     = "mcp-server-2"
  }

  lifecycle {
    ignore_changes = [
      metadata["ssh-keys"],
      metadata["user-data"]
    ]
  }
}
