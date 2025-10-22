resource "google_compute_instance" "vm_instance" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone
  
  tags = var.tags
  
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = var.disk_size_gb
      type  = "pd-standard"
    }
  }
  
  network_interface {
    network    = var.network_name
    subnetwork = var.subnet_name
    
    access_config {
      nat_ip = var.static_ip
    }
  }
  
  metadata = {
    ssh-keys = var.ssh_public_key != "" ? "${var.ssh_user}:${var.ssh_public_key}" : ""
  }
  
  metadata_startup_script = <<-EOF
    #!/bin/bash
    
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    
    # Add user to docker group
    usermod -aG docker ${var.ssh_user}
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Create working directory
    mkdir -p /opt/desarollo
    chown -R ${var.ssh_user}:${var.ssh_user} /opt/desarollo
    
    echo "VM setup completed" > /var/log/startup-script.log
  EOF
  
  labels = {
    environment = var.environment
    managed_by  = "terraform"
    project     = "desarollo"
  }
}
