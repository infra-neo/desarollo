#!/usr/bin/env python3
"""
JumpServer User Import Script
Imports 50 users into JumpServer via API
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

def create_user(user_data: Dict) -> bool:
    """Create a single user in JumpServer"""
    try:
        response = requests.post(
            f'{JUMPSERVER_URL}/api/v1/users/users/',
            headers=headers,
            json=user_data
        )
        
        if response.status_code in [200, 201]:
            print(f"✓ Created user: {user_data['username']}")
            return True
        else:
            print(f"✗ Failed to create user {user_data['username']}: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error creating user {user_data['username']}: {str(e)}")
        return False

def generate_users() -> List[Dict]:
    """Generate 50 user accounts"""
    users = []
    
    # Create departments/groups
    departments = [
        'Operations',
        'Finance',
        'IT',
        'Management',
        'Support'
    ]
    
    for i in range(1, 51):
        department = departments[(i - 1) % len(departments)]
        user = {
            'username': f'user{i:02d}',
            'name': f'User {i:02d}',
            'email': f'user{i:02d}@example.com',
            'is_active': True,
            'role': 'User',
            'groups': [department],
            'source': 'local',
            'comment': f'Auto-generated user {i} for {department} department',
            'mfa_level': 2  # Require MFA
        }
        users.append(user)
    
    # Add some admin users
    admin_users = [
        {
            'username': 'admin_ops',
            'name': 'Operations Admin',
            'email': 'admin.ops@example.com',
            'is_active': True,
            'role': 'Admin',
            'groups': ['Operations', 'Administrators'],
            'source': 'local',
            'comment': 'Operations administrator',
            'mfa_level': 2
        },
        {
            'username': 'admin_security',
            'name': 'Security Admin',
            'email': 'admin.security@example.com',
            'is_active': True,
            'role': 'Admin',
            'groups': ['IT', 'Administrators'],
            'source': 'local',
            'comment': 'Security administrator',
            'mfa_level': 2
        }
    ]
    
    users.extend(admin_users)
    return users

def create_user_groups() -> None:
    """Create user groups in JumpServer"""
    groups = [
        {'name': 'Operations', 'comment': 'Operations team'},
        {'name': 'Finance', 'comment': 'Finance team'},
        {'name': 'IT', 'comment': 'IT team'},
        {'name': 'Management', 'comment': 'Management team'},
        {'name': 'Support', 'comment': 'Support team'},
        {'name': 'Administrators', 'comment': 'System administrators'}
    ]
    
    for group in groups:
        try:
            response = requests.post(
                f'{JUMPSERVER_URL}/api/v1/users/groups/',
                headers=headers,
                json=group
            )
            
            if response.status_code in [200, 201]:
                print(f"✓ Created group: {group['name']}")
            elif response.status_code == 400:
                print(f"ℹ Group already exists: {group['name']}")
            else:
                print(f"✗ Failed to create group {group['name']}: {response.text}")
                
        except Exception as e:
            print(f"✗ Error creating group {group['name']}: {str(e)}")

def main():
    """Main function"""
    print("=" * 60)
    print("JumpServer User Import Script")
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
    
    # Create groups
    print("Creating user groups...")
    create_user_groups()
    print()
    
    # Generate and create users
    print("Creating users...")
    users = generate_users()
    
    success_count = 0
    fail_count = 0
    
    for user in users:
        if create_user(user):
            success_count += 1
        else:
            fail_count += 1
    
    print()
    print("=" * 60)
    print(f"Import completed: {success_count} succeeded, {fail_count} failed")
    print("=" * 60)

if __name__ == '__main__':
    main()
