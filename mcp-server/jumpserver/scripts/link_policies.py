#!/usr/bin/env python3
"""
JumpServer Policy Linking Script
Links user groups to banking assets with appropriate permissions
"""

import os
import sys
import requests
import json
from typing import List, Dict

# Configuration
JUMPSERVER_URL = os.getenv('JUMPSERVER_URL', 'http://localhost:8080')
API_KEY = os.getenv('JUMPSERVER_API_KEY')

if not API_KEY:
    print("Error: JUMPSERVER_API_KEY environment variable not set")
    sys.exit(1)

# Headers for API requests
headers = {
    'Authorization': f'Token {API_KEY}',
    'Content-Type': 'application/json'
}

def get_user_groups() -> List[Dict]:
    """Get all user groups"""
    try:
        response = requests.get(
            f'{JUMPSERVER_URL}/api/v1/users/groups/',
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            return data.get('results', data) if isinstance(data, dict) else data
        return []
    except Exception as e:
        print(f"Error getting user groups: {str(e)}")
        return []

def get_assets() -> List[Dict]:
    """Get all assets"""
    try:
        response = requests.get(
            f'{JUMPSERVER_URL}/api/v1/assets/assets/',
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            return data.get('results', data) if isinstance(data, dict) else data
        return []
    except Exception as e:
        print(f"Error getting assets: {str(e)}")
        return []

def create_asset_permission(name: str, user_groups: List[str], assets: List[str]) -> bool:
    """Create an asset permission policy"""
    permission_data = {
        'name': name,
        'user_groups': user_groups,
        'assets': assets,
        'actions': ['connect', 'upload', 'download'],
        'is_active': True,
        'comment': f'Auto-generated permission: {name}'
    }
    
    try:
        response = requests.post(
            f'{JUMPSERVER_URL}/api/v1/perms/asset-permissions/',
            headers=headers,
            json=permission_data
        )
        
        if response.status_code in [200, 201]:
            print(f"✓ Created permission: {name}")
            return True
        else:
            print(f"✗ Failed to create permission {name}: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error creating permission {name}: {str(e)}")
        return False

def main():
    """Main function"""
    print("=" * 60)
    print("JumpServer Policy Linking Script")
    print("=" * 60)
    print()
    
    # Test connection
    try:
        response = requests.get(
            f'{JUMPSERVER_URL}/api/v1/users/users/',
            headers=headers
        )
        if response.status_code != 200:
            print(f"Error: Cannot connect to JumpServer API: {response.status_code}")
            sys.exit(1)
    except Exception as e:
        print(f"Error: Cannot connect to JumpServer: {str(e)}")
        sys.exit(1)
    
    print("✓ Connected to JumpServer API")
    print()
    
    # Get user groups and assets
    print("Fetching user groups...")
    user_groups = get_user_groups()
    print(f"Found {len(user_groups)} user groups")
    
    print("Fetching assets...")
    assets = get_assets()
    print(f"Found {len(assets)} assets")
    print()
    
    if not user_groups or not assets:
        print("Error: No user groups or assets found. Run import scripts first.")
        sys.exit(1)
    
    # Create group-to-asset mappings
    group_map = {}
    for group in user_groups:
        group_map[group['name']] = group['id']
    
    asset_ids = [asset['id'] for asset in assets]
    
    # Create permission policies
    print("Creating permission policies...")
    
    policies = [
        {
            'name': 'Operations - All Banking Sites',
            'groups': ['Operations'],
            'assets': asset_ids[:15]  # First 15 sites
        },
        {
            'name': 'Finance - Financial Banking Sites',
            'groups': ['Finance'],
            'assets': asset_ids[:20]  # First 20 sites
        },
        {
            'name': 'IT - All Banking Sites',
            'groups': ['IT'],
            'assets': asset_ids  # All sites
        },
        {
            'name': 'Management - All Banking Sites',
            'groups': ['Management'],
            'assets': asset_ids  # All sites
        },
        {
            'name': 'Support - Limited Banking Sites',
            'groups': ['Support'],
            'assets': asset_ids[:10]  # First 10 sites
        },
        {
            'name': 'Administrators - Full Access',
            'groups': ['Administrators'],
            'assets': asset_ids  # All sites
        }
    ]
    
    success_count = 0
    fail_count = 0
    
    for policy in policies:
        # Convert group names to IDs
        group_ids = [group_map[g] for g in policy['groups'] if g in group_map]
        
        if group_ids:
            if create_asset_permission(
                policy['name'],
                group_ids,
                policy['assets']
            ):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"✗ Skipping {policy['name']}: groups not found")
            fail_count += 1
    
    print()
    print("=" * 60)
    print(f"Policy creation completed: {success_count} succeeded, {fail_count} failed")
    print("=" * 60)

if __name__ == '__main__':
    main()
