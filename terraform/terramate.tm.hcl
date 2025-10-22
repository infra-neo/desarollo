terramate {
  required_version = ">= 0.4.0"
  
  config {
    git {
      default_branch = "main"
      check_untracked = false
    }
  }
}

globals {
  project_name = "desarollo"
  cloud_provider = "gcp"
  region = "us-central1"
  zone = "us-central1-a"
  owner = "Ing. Benjamín Frías — DevOps & Cloud Specialist"
}
