terraform {
  required_version = ">= 1.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Uncomment for remote state storage
  # backend "gcs" {
  #   bucket = "mcp-server-terraform-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# VPC Network
resource "google_compute_network" "mcp_network" {
  name                    = "${var.project_name}-network"
  auto_create_subnetworks = false
  description             = "VPC network for MCP Server infrastructure"
}

# Subnet
resource "google_compute_subnetwork" "mcp_subnet" {
  name          = "${var.project_name}-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.mcp_network.id

  private_ip_google_access = true
}

# Cloud NAT for outbound internet access
resource "google_compute_router" "mcp_router" {
  name    = "${var.project_name}-router"
  region  = var.region
  network = google_compute_network.mcp_network.id
}

resource "google_compute_router_nat" "mcp_nat" {
  name                               = "${var.project_name}-nat"
  router                             = google_compute_router.mcp_router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

# Static external IP
resource "google_compute_address" "mcp_static_ip" {
  name   = "${var.project_name}-static-ip"
  region = var.region
}

# Firewall Rules
resource "google_compute_firewall" "allow_http" {
  name    = "${var.project_name}-allow-http"
  network = google_compute_network.mcp_network.name

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["mcp-server"]
}

resource "google_compute_firewall" "allow_https" {
  name    = "${var.project_name}-allow-https"
  network = google_compute_network.mcp_network.name

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["mcp-server"]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.project_name}-allow-ssh"
  network = google_compute_network.mcp_network.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = var.ssh_allowed_ips
  target_tags   = ["mcp-server"]
}

resource "google_compute_firewall" "allow_tailscale" {
  name    = "${var.project_name}-allow-tailscale"
  network = google_compute_network.mcp_network.name

  allow {
    protocol = "udp"
    ports    = ["41641"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["mcp-server"]
}

resource "google_compute_firewall" "allow_internal" {
  name    = "${var.project_name}-allow-internal"
  network = google_compute_network.mcp_network.name

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

  source_ranges = [var.subnet_cidr]
  target_tags   = ["mcp-server"]
}

# Compute Instance
resource "google_compute_instance" "mcp_server" {
  name         = "${var.project_name}-instance"
  machine_type = var.machine_type
  zone         = var.zone

  tags = ["mcp-server", "http-server", "https-server"]

  boot_disk {
    initialize_params {
      image = var.boot_disk_image
      size  = var.boot_disk_size_gb
      type  = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.mcp_subnet.id

    access_config {
      nat_ip = google_compute_address.mcp_static_ip.address
    }
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${file(var.ssh_public_key_path)}"
  }

  metadata_startup_script = templatefile("${path.module}/startup-script.sh", {
    domain           = var.domain
    tailscale_key    = var.tailscale_auth_key
    authentik_secret = var.authentik_secret_key
  })

  service_account {
    email  = google_service_account.mcp_sa.email
    scopes = ["cloud-platform"]
  }

  allow_stopping_for_update = true

  labels = {
    environment = var.environment
    managed_by  = "terraform"
    project     = var.project_name
  }
}

# Service Account
resource "google_service_account" "mcp_sa" {
  account_id   = "${var.project_name}-sa"
  display_name = "MCP Server Service Account"
  description  = "Service account for MCP Server instance"
}

# IAM Role for Service Account
resource "google_project_iam_member" "mcp_sa_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.mcp_sa.email}"
}

resource "google_project_iam_member" "mcp_sa_monitoring" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.mcp_sa.email}"
}

# Cloud DNS (optional - if using custom domain)
resource "google_dns_managed_zone" "mcp_zone" {
  count       = var.create_dns_zone ? 1 : 0
  name        = "${var.project_name}-zone"
  dns_name    = "${var.domain}."
  description = "DNS zone for MCP Server"
}

resource "google_dns_record_set" "mcp_a_record" {
  count        = var.create_dns_zone ? 1 : 0
  name         = "*.${var.domain}."
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.mcp_zone[0].name
  rrdatas      = [google_compute_address.mcp_static_ip.address]
}
