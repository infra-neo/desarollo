#!/usr/bin/env python3
"""
Import users into KasmWeb from CSV or Authentik
"""

import os
import sys
import csv
import argparse
import requests
import hmac
import hashlib
import time
from typing import List, Dict


class KasmUserImporter:
    """Import users into KasmWeb"""
    
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
    
    def create_user(self, user_data: Dict) -> bool:
        """Create a single user in Kasm"""
        try:
            data = {
                'target_user': {
                    'username': user_data['username'],
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                    'email': user_data['email'],
                    'password': user_data.get('password', ''),
                    'disabled': False
                }
            }
            
            if 'phone' in user_data:
                data['target_user']['phone'] = user_data['phone']
            
            result = self._make_request('/create_user', data)
            print(f"✓ Created user: {user_data['username']}")
            return True
        
        except Exception as e:
            print(f"✗ Failed to create user {user_data['username']}: {str(e)}")
            return False
    
    def import_from_csv(self, csv_file: str) -> tuple:
        """Import users from CSV file"""
        success_count = 0
        error_count = 0
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if self.create_user(row):
                    success_count += 1
                else:
                    error_count += 1
        
        return success_count, error_count
    
    def import_from_authentik(self, authentik_url: str, authentik_token: str) -> tuple:
        """Import users from Authentik"""
        success_count = 0
        error_count = 0
        
        # Get users from Authentik
        headers = {'Authorization': f'Bearer {authentik_token}'}
        response = requests.get(
            f"{authentik_url}/api/v3/core/users/",
            headers=headers
        )
        response.raise_for_status()
        
        users = response.json().get('results', [])
        
        for user in users:
            user_data = {
                'username': user['username'],
                'email': user['email'],
                'first_name': user.get('name', '').split()[0] if user.get('name') else '',
                'last_name': ' '.join(user.get('name', '').split()[1:]) if user.get('name') else '',
                'password': ''  # Users will use SSO
            }
            
            if self.create_user(user_data):
                success_count += 1
            else:
                error_count += 1
        
        return success_count, error_count


def main():
    parser = argparse.ArgumentParser(description='Import users into KasmWeb')
    parser.add_argument('--kasm-url', required=True, help='KasmWeb URL')
    parser.add_argument('--api-key', required=True, help='Kasm API Key')
    parser.add_argument('--api-secret', required=True, help='Kasm API Secret')
    parser.add_argument('--source', choices=['csv', 'authentik'], required=True, 
                       help='Source of users')
    parser.add_argument('--csv-file', help='CSV file path (for csv source)')
    parser.add_argument('--authentik-url', help='Authentik URL (for authentik source)')
    parser.add_argument('--authentik-token', help='Authentik API token (for authentik source)')
    
    args = parser.parse_args()
    
    # Validate source-specific arguments
    if args.source == 'csv' and not args.csv_file:
        print("Error: --csv-file is required when source is csv")
        sys.exit(1)
    
    if args.source == 'authentik' and (not args.authentik_url or not args.authentik_token):
        print("Error: --authentik-url and --authentik-token are required when source is authentik")
        sys.exit(1)
    
    # Create importer
    importer = KasmUserImporter(args.kasm_url, args.api_key, args.api_secret)
    
    # Import users
    print(f"Starting user import from {args.source}...")
    
    if args.source == 'csv':
        success, errors = importer.import_from_csv(args.csv_file)
    else:
        success, errors = importer.import_from_authentik(args.authentik_url, args.authentik_token)
    
    print(f"\nImport completed:")
    print(f"  ✓ Successfully imported: {success}")
    print(f"  ✗ Errors: {errors}")
    
    return 0 if errors == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
