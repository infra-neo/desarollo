# Firewall rules for MCP Server 2 - Zero Trust approach

# Allow HTTP (port 80) - for Let's Encrypt HTTP challenge
resource "google_compute_firewall" "allow_http" {
  count   = var.allow_http ? 1 : 0
  name    = "${var.network_name}-allow-http"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.network_tags

  description = "Allow HTTP for Let's Encrypt certificate validation"
}

# Allow HTTPS (port 443) - main entry point via Traefik
resource "google_compute_firewall" "allow_https" {
  count   = var.allow_https ? 1 : 0
  name    = "${var.network_name}-allow-https"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.network_tags

  description = "Allow HTTPS for web services via Traefik"
}

# Allow SSH (port 22) - for administrative access
resource "google_compute_firewall" "allow_ssh" {
  count   = var.allow_ssh ? 1 : 0
  name    = "${var.network_name}-allow-ssh"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # Restrict to specific IPs or use IAP
  source_ranges = var.ssh_source_ranges

  target_tags = var.network_tags

  description = "Allow SSH for administrative access"
}

# Allow Tailscale VPN
resource "google_compute_firewall" "allow_tailscale" {
  name    = "${var.network_name}-allow-tailscale"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "udp"
    ports    = ["41641"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.network_tags

  description = "Allow Tailscale VPN"
}

# Internal communication within VPC
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.network_name}-allow-internal"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/24"]
  target_tags   = var.network_tags

  description = "Allow internal communication within VPC"
}

# Health checks from Google Cloud Load Balancer
resource "google_compute_firewall" "allow_health_check" {
  name    = "${var.network_name}-allow-health-check"
  network = var.network_name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  # Google Cloud health check IP ranges
  source_ranges = [
    "35.191.0.0/16",
    "130.211.0.0/22"
  ]

  target_tags = var.network_tags

  description = "Allow health checks from Google Cloud Load Balancer"
}

# Deny all other traffic (implicit, but explicit for clarity)
resource "google_compute_firewall" "deny_all" {
  name     = "${var.network_name}-deny-all"
  network  = var.network_name
  project  = var.project_id
  priority = 65534

  deny {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]

  description = "Deny all other traffic not explicitly allowed"
}
