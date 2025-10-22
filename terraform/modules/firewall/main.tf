resource "google_compute_firewall" "allow_http" {
  count = var.allow_http ? 1 : 0
  
  name    = "${var.network_name}-allow-http"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "tcp"
    ports    = ["80"]
  }
  
  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.network_tags
}

resource "google_compute_firewall" "allow_https" {
  count = var.allow_https ? 1 : 0
  
  name    = "${var.network_name}-allow-https"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "tcp"
    ports    = ["443"]
  }
  
  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.network_tags
}

resource "google_compute_firewall" "allow_ssh" {
  count = var.allow_ssh ? 1 : 0
  
  name    = "${var.network_name}-allow-ssh"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  
  source_ranges = var.ssh_source_ranges
  target_tags   = var.network_tags
}

resource "google_compute_firewall" "allow_swarm_tcp" {
  count = var.allow_swarm ? 1 : 0
  
  name    = "${var.network_name}-allow-swarm-tcp"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "tcp"
    ports    = ["2377", "7946"]
  }
  
  source_ranges = ["10.0.0.0/8"]
  target_tags   = var.network_tags
}

resource "google_compute_firewall" "allow_swarm_udp" {
  count = var.allow_swarm ? 1 : 0
  
  name    = "${var.network_name}-allow-swarm-udp"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "udp"
    ports    = ["7946", "4789"]
  }
  
  source_ranges = ["10.0.0.0/8"]
  target_tags   = var.network_tags
}

resource "google_compute_firewall" "allow_observability" {
  count = var.allow_observability ? 1 : 0
  
  name    = "${var.network_name}-allow-observability"
  network = var.network_name
  project = var.project_id
  
  allow {
    protocol = "tcp"
    ports    = ["3000", "3100", "9090"]
  }
  
  source_ranges = var.observability_source_ranges
  target_tags   = var.network_tags
}
