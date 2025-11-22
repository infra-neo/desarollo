output "firewall_rules" {
  description = "List of firewall rules created"
  value = concat(
    var.allow_http ? [google_compute_firewall.allow_http[0].name] : [],
    var.allow_https ? [google_compute_firewall.allow_https[0].name] : [],
    var.allow_ssh ? [google_compute_firewall.allow_ssh[0].name] : [],
    [google_compute_firewall.allow_tailscale.name],
    [google_compute_firewall.allow_internal.name],
    [google_compute_firewall.allow_health_check.name],
    [google_compute_firewall.deny_all.name]
  )
}
