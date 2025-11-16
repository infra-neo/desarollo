#!/usr/bin/env python3
"""
Brainboard Architecture Generator
Generates Brainboard-compatible JSON diagrams from Terraform infrastructure
Author: Ing. Benjamín Frías — DevOps & Cloud Specialist
"""

import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Any

class BrainboardGenerator:
    def __init__(self):
        self.components = []
        self.connections = []
        self.subnets = []
        self.component_id_counter = 1
        
    def add_component(self, name: str, type: str, properties: Dict[str, Any], subnet: str = None) -> int:
        """Add a component to the architecture"""
        component_id = self.component_id_counter
        self.component_id_counter += 1
        
        component = {
            "id": f"comp_{component_id}",
            "name": name,
            "type": type,
            "properties": properties,
            "subnet": subnet,
            "position": self._calculate_position(component_id, type)
        }
        
        self.components.append(component)
        return component_id
    
    def add_connection(self, source_id: int, target_id: int, type: str = "network", bidirectional: bool = False):
        """Add a connection between components"""
        connection = {
            "source": f"comp_{source_id}",
            "target": f"comp_{target_id}",
            "type": type,
            "bidirectional": bidirectional
        }
        self.connections.append(connection)
    
    def add_subnet(self, name: str, cidr: str, zone: str, components: List[int] = None):
        """Add a subnet/network segment"""
        subnet = {
            "name": name,
            "cidr": cidr,
            "zone": zone,
            "components": [f"comp_{c}" for c in (components or [])]
        }
        self.subnets.append(subnet)
    
    def _calculate_position(self, id: int, type: str) -> Dict[str, int]:
        """Calculate position for visual layout"""
        # Simple grid layout
        row = (id - 1) // 4
        col = (id - 1) % 4
        
        return {
            "x": col * 200 + 100,
            "y": row * 150 + 100
        }
    
    def generate_full_architecture(self):
        """Generate the complete MCP Server architecture"""
        
        # VPC and Networking
        vpc_id = self.add_component(
            "desarollo-vpc",
            "gcp.network.vpc",
            {
                "cidr": "10.0.0.0/16",
                "region": "us-central1"
            }
        )
        
        # Subnets
        public_subnet = self.add_component(
            "public-subnet",
            "gcp.network.subnet",
            {
                "cidr": "10.0.1.0/24",
                "zone": "us-central1-a"
            }
        )
        
        private_subnet = self.add_component(
            "private-subnet",
            "gcp.network.subnet",
            {
                "cidr": "10.0.2.0/24",
                "zone": "us-central1-a"
            }
        )
        
        database_subnet = self.add_component(
            "database-subnet",
            "gcp.network.subnet",
            {
                "cidr": "10.0.3.0/24",
                "zone": "us-central1-a"
            }
        )
        
        # PostgreSQL Database
        postgres_id = self.add_component(
            "PostgreSQL Master",
            "gcp.sql.database",
            {
                "version": "POSTGRES_15",
                "tier": "db-g1-small",
                "databases": [
                    "authentik",
                    "jumpserver",
                    "infisical",
                    "onepanel",
                    "webasset"
                ]
            },
            "database-subnet"
        )
        
        # Load Balancer / Traefik
        traefik_id = self.add_component(
            "Traefik Reverse Proxy",
            "docker.service",
            {
                "image": "traefik:v2.10",
                "ports": ["80", "443"],
                "features": [
                    "SSL Termination",
                    "Load Balancing",
                    "Auto-Discovery",
                    "Let's Encrypt"
                ]
            },
            "public-subnet"
        )
        
        # Authentik
        authentik_id = self.add_component(
            "Authentik IdP",
            "docker.service",
            {
                "image": "goauthentik/server:2024.2.2",
                "replicas": 2,
                "features": [
                    "OIDC Provider",
                    "SAML Provider",
                    "LDAP Provider",
                    "ForwardAuth"
                ]
            },
            "private-subnet"
        )
        
        # Redis
        redis_id = self.add_component(
            "Redis Cache",
            "docker.service",
            {
                "image": "redis:7-alpine",
                "persistence": True
            },
            "private-subnet"
        )
        
        # Infisical
        infisical_id = self.add_component(
            "Infisical Secrets",
            "docker.service",
            {
                "image": "infisical/infisical:latest",
                "replicas": 2,
                "features": [
                    "Secret Management",
                    "Key Rotation",
                    "Audit Logs"
                ]
            },
            "private-subnet"
        )
        
        # JumpServer
        jumpserver_id = self.add_component(
            "JumpServer Audit",
            "docker.service",
            {
                "image": "jumpserver/jms_all:v3.10.3",
                "replicas": 2,
                "features": [
                    "Session Recording",
                    "Audit Trail",
                    "Asset Management",
                    "OIDC Integration"
                ]
            },
            "private-subnet"
        )
        
        # 1Panel
        onepanel_id = self.add_component(
            "1Panel Admin",
            "docker.service",
            {
                "image": "moelin/1panel:latest",
                "features": [
                    "Server Management",
                    "Docker Management",
                    "File Manager"
                ]
            },
            "private-subnet"
        )
        
        # WebAsset Controller
        webasset_id = self.add_component(
            "WebAsset Controller",
            "docker.service",
            {
                "image": "webasset-controller:latest",
                "replicas": 3,
                "features": [
                    "Browser Automation",
                    "BMG Integration",
                    "iCred Integration",
                    "Session Recording",
                    "OIDC Authentication"
                ]
            },
            "private-subnet"
        )
        
        # Banking Endpoints (External)
        bmg_id = self.add_component(
            "BMG Consig",
            "external.service",
            {
                "url": "https://www.bmgconsig.com.br",
                "type": "Banking Platform"
            }
        )
        
        icred_id = self.add_component(
            "iCred API",
            "external.service",
            {
                "url": "https://api.icred.app",
                "type": "Banking API"
            }
        )
        
        # Tailscale VPN
        tailscale_id = self.add_component(
            "Tailscale VPN",
            "service.vpn",
            {
                "features": [
                    "Zero Trust Network",
                    "MagicDNS",
                    "ACL-based Access"
                ]
            },
            "public-subnet"
        )
        
        # End Users
        users_id = self.add_component(
            "End Users (50 concurrent)",
            "user.group",
            {
                "count": 50,
                "authentication": "SSO via Authentik"
            }
        )
        
        # Define connections
        # Internet -> Traefik
        self.add_connection(users_id, traefik_id, "https")
        
        # Traefik -> Services
        self.add_connection(traefik_id, authentik_id, "http")
        self.add_connection(traefik_id, infisical_id, "http")
        self.add_connection(traefik_id, jumpserver_id, "http")
        self.add_connection(traefik_id, onepanel_id, "http")
        self.add_connection(traefik_id, webasset_id, "http")
        
        # Services -> Redis
        self.add_connection(authentik_id, redis_id, "redis")
        self.add_connection(infisical_id, redis_id, "redis")
        self.add_connection(jumpserver_id, redis_id, "redis")
        
        # Services -> PostgreSQL
        self.add_connection(authentik_id, postgres_id, "postgresql")
        self.add_connection(jumpserver_id, postgres_id, "postgresql")
        self.add_connection(infisical_id, postgres_id, "postgresql")
        self.add_connection(onepanel_id, postgres_id, "postgresql")
        self.add_connection(webasset_id, postgres_id, "postgresql")
        
        # WebAsset -> Infisical (for secrets)
        self.add_connection(webasset_id, infisical_id, "api")
        
        # WebAsset -> JumpServer (for audit)
        self.add_connection(webasset_id, jumpserver_id, "api")
        
        # WebAsset -> Banking (outbound)
        self.add_connection(webasset_id, bmg_id, "https")
        self.add_connection(webasset_id, icred_id, "https")
        
        # Tailscale connections
        self.add_connection(tailscale_id, traefik_id, "vpn")
        self.add_connection(tailscale_id, onepanel_id, "vpn")
        
        # Define subnets with their components
        self.add_subnet("Public Subnet", "10.0.1.0/24", "us-central1-a", [traefik_id, tailscale_id])
        self.add_subnet("Private Subnet", "10.0.2.0/24", "us-central1-a", 
                       [authentik_id, redis_id, infisical_id, jumpserver_id, onepanel_id, webasset_id])
        self.add_subnet("Database Subnet", "10.0.3.0/24", "us-central1-a", [postgres_id])
    
    def generate_json(self) -> Dict[str, Any]:
        """Generate Brainboard-compatible JSON"""
        return {
            "version": "1.0",
            "metadata": {
                "name": "MCP Server Infrastructure - Desarollo",
                "author": "Ing. Benjamín Frías — DevOps & Cloud Specialist",
                "description": "Complete MCP Server infrastructure with Banking Automation",
                "created": datetime.now().isoformat(),
                "provider": "gcp",
                "region": "us-central1"
            },
            "architecture": {
                "components": self.components,
                "connections": self.connections,
                "subnets": self.subnets
            },
            "security": {
                "firewall_rules": [
                    {
                        "name": "allow-https-ingress",
                        "direction": "ingress",
                        "protocol": "tcp",
                        "port": "443",
                        "source": "0.0.0.0/0",
                        "target": "public-subnet"
                    },
                    {
                        "name": "deny-all-database",
                        "direction": "ingress",
                        "protocol": "all",
                        "port": "all",
                        "source": "0.0.0.0/0",
                        "target": "database-subnet",
                        "action": "deny"
                    }
                ],
                "encryption": {
                    "in_transit": "TLS 1.3",
                    "at_rest": "AES-256"
                },
                "authentication": {
                    "method": "OIDC",
                    "provider": "Authentik",
                    "mfa": "enabled"
                }
            },
            "terraform": {
                "modules": [
                    "modules/compute",
                    "modules/network",
                    "modules/firewall",
                    "modules/postgresql",
                    "modules/authentik",
                    "modules/tailscale",
                    "modules/traefik",
                    "modules/jumpserver",
                    "modules/infisical",
                    "modules/onepanel",
                    "modules/webasset-controller"
                ],
                "state_backend": "gcs",
                "state_bucket": "desarollo-terraform-state"
            }
        }
    
    def save_to_file(self, filepath: str):
        """Save the architecture to a JSON file"""
        data = self.generate_json()
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Brainboard architecture saved to: {filepath}")
        return filepath

def main():
    print("🏗️  Generating Brainboard Architecture...")
    
    generator = BrainboardGenerator()
    generator.generate_full_architecture()
    
    # Save to brainboard directory
    output_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "brainboard",
        "architecture_brainboard.json"
    )
    
    generator.save_to_file(output_path)
    
    print("\n📊 Architecture Summary:")
    print(f"   - Components: {len(generator.components)}")
    print(f"   - Connections: {len(generator.connections)}")
    print(f"   - Subnets: {len(generator.subnets)}")
    print("\n✨ Done! Import this file into Brainboard for visualization.")

if __name__ == "__main__":
    main()
