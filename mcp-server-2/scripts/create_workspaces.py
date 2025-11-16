#!/usr/bin/env python3
"""
Create workspaces for banking sites in KasmWeb
"""

import os
import sys
import argparse
import requests
import hmac
import hashlib
import time
import yaml


class KasmWorkspaceCreator:
    """Create Kasm workspaces for banking sites"""
    
    def __init__(self, kasm_url: str, api_key: str, api_secret: str):
        self.kasm_url = kasm_url.rstrip('/')
        self.api_key = api_key
        self.api_secret = api_secret
    
    def _generate_signature(self, data: dict) -> str:
        """Generate HMAC signature"""
        message = f"{data['timestamp']}{self.api_key}"
        signature = hmac.new(
            self.api_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def _make_request(self, endpoint: str, data: dict) -> dict:
        """Make API request to Kasm"""
        url = f"{self.kasm_url}/api/public{endpoint}"
        
        data['timestamp'] = int(time.time())
        data['api_key'] = self.api_key
        data['signature'] = self._generate_signature(data)
        
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def create_workspace(self, banking_site: dict) -> bool:
        """Create a workspace for a banking site"""
        try:
            data = {
                'workspace': {
                    'friendly_name': f"{banking_site['name']} - {banking_site['code']}",
                    'description': f"Remote browser workspace for {banking_site['name']}",
                    'docker_image': 'kasmweb/chrome:latest',
                    'cores': 2,
                    'memory': 2048,
                    'gpu_count': 0,
                    'persistent_profile': False,
                    'run_config': {
                        'hostname': banking_site['code'].lower(),
                        'environment': {
                            'START_URL': banking_site['url']
                        }
                    },
                    'thumbnail_url': f"https://logo.clearbit.com/{banking_site['url'].split('//')[1].split('/')[0]}"
                }
            }
            
            result = self._make_request('/create_workspace', data)
            print(f"✓ Created workspace for: {banking_site['name']} ({banking_site['code']})")
            return True
        
        except Exception as e:
            print(f"✗ Failed to create workspace for {banking_site['code']}: {str(e)}")
            return False
    
    def load_banking_sites(self, config_file: str) -> list:
        """Load banking sites from YAML config"""
        with open(config_file, 'r') as f:
            config = yaml.safe_load(f)
        return config.get('banking_sites', [])
    
    def create_all_workspaces(self, config_file: str) -> tuple:
        """Create workspaces for all banking sites"""
        sites = self.load_banking_sites(config_file)
        success_count = 0
        error_count = 0
        
        for site in sites:
            if site.get('is_active', True):
                if self.create_workspace(site):
                    success_count += 1
                else:
                    error_count += 1
            else:
                print(f"⊘ Skipping inactive site: {site['code']}")
        
        return success_count, error_count


def main():
    parser = argparse.ArgumentParser(description='Create KasmWeb workspaces for banking sites')
    parser.add_argument('--kasm-url', required=True, help='KasmWeb URL')
    parser.add_argument('--api-key', required=True, help='Kasm API Key')
    parser.add_argument('--api-secret', required=True, help='Kasm API Secret')
    parser.add_argument('--config', required=True, help='Banking sites YAML config file')
    
    args = parser.parse_args()
    
    # Create workspace creator
    creator = KasmWorkspaceCreator(args.kasm_url, args.api_key, args.api_secret)
    
    # Create workspaces
    print("Starting workspace creation...")
    success, errors = creator.create_all_workspaces(args.config)
    
    print(f"\nWorkspace creation completed:")
    print(f"  ✓ Successfully created: {success}")
    print(f"  ✗ Errors: {errors}")
    
    return 0 if errors == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
