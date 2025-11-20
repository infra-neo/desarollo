#!/usr/bin/env python3
"""
JumpServer Asset Import Script
Imports 25 banking websites as assets in JumpServer
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

# 25 Banking sites
BANKING_SITES = [
    {
        'name': 'BMG Consignado',
        'url': 'https://www.bmgconsig.com.br/Index.do?method=prepare',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'iCred',
        'url': 'https://api.icred.app/authorization-server/custom-login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco do Brasil',
        'url': 'https://www.bb.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Caixa Economica Federal',
        'url': 'https://internetbanking.caixa.gov.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Itaú',
        'url': 'https://www.itau.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Bradesco',
        'url': 'https://banco.bradesco/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Santander',
        'url': 'https://www.santander.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Inter',
        'url': 'https://inter.co/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Nubank',
        'url': 'https://app.nubank.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Pan',
        'url': 'https://www.bancopan.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Safra',
        'url': 'https://www.safra.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Original',
        'url': 'https://www.original.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banrisul',
        'url': 'https://www.banrisul.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Sicoob',
        'url': 'https://www.sicoob.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Sicredi',
        'url': 'https://www.sicredi.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Votorantim',
        'url': 'https://www.bv.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'C6 Bank',
        'url': 'https://www.c6bank.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'PagBank',
        'url': 'https://pagseguro.uol.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Mercado Pago',
        'url': 'https://www.mercadopago.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'BS2',
        'url': 'https://www.bs2.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Daycoval',
        'url': 'https://www.daycoval.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Bmg',
        'url': 'https://www.bancobmg.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Sofisa',
        'url': 'https://www.sofisa.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Pine',
        'url': 'https://www.pine.com/login',
        'category': 'Banking',
        'country': 'Brazil'
    },
    {
        'name': 'Banco Modal',
        'url': 'https://www.modal.com.br/login',
        'category': 'Banking',
        'country': 'Brazil'
    }
]

def create_domain() -> str:
    """Create or get the web domain"""
    domain_data = {
        'name': 'Banking Web Assets',
        'comment': 'Domain for banking website assets'
    }
    
    try:
        # Try to create domain
        response = requests.post(
            f'{JUMPSERVER_URL}/api/v1/assets/domains/',
            headers=headers,
            json=domain_data
        )
        
        if response.status_code in [200, 201]:
            domain_id = response.json()['id']
            print(f"✓ Created domain: {domain_data['name']}")
            return domain_id
        elif response.status_code == 400:
            # Domain might already exist, try to get it
            response = requests.get(
                f'{JUMPSERVER_URL}/api/v1/assets/domains/',
                headers=headers
            )
            domains = response.json()['results'] if 'results' in response.json() else response.json()
            for domain in domains:
                if domain['name'] == domain_data['name']:
                    print(f"ℹ Using existing domain: {domain_data['name']}")
                    return domain['id']
        
        print(f"✗ Failed to create/get domain: {response.text}")
        return None
        
    except Exception as e:
        print(f"✗ Error with domain: {str(e)}")
        return None

def create_web_asset(site: Dict, domain_id: str) -> bool:
    """Create a web asset in JumpServer"""
    asset_data = {
        'name': site['name'],
        'address': site['url'],
        'protocols': [
            {
                'name': 'http',
                'port': 443 if 'https' in site['url'] else 80
            }
        ],
        'platform': 'Web',
        'is_active': True,
        'domain': domain_id,
        'comment': f"{site['category']} - {site['country']}",
        'labels': [site['category'], site['country']]
    }
    
    try:
        response = requests.post(
            f'{JUMPSERVER_URL}/api/v1/assets/assets/',
            headers=headers,
            json=asset_data
        )
        
        if response.status_code in [200, 201]:
            print(f"✓ Created asset: {site['name']}")
            return True
        else:
            print(f"✗ Failed to create asset {site['name']}: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error creating asset {site['name']}: {str(e)}")
        return False

def main():
    """Main function"""
    print("=" * 60)
    print("JumpServer Asset Import Script")
    print("=" * 60)
    print()
    
    # Test connection
    try:
        response = requests.get(
            f'{JUMPSERVER_URL}/api/v1/assets/assets/',
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
    
    # Create domain
    print("Creating domain...")
    domain_id = create_domain()
    if not domain_id:
        print("Error: Failed to create/get domain")
        sys.exit(1)
    print()
    
    # Create assets
    print(f"Creating {len(BANKING_SITES)} banking assets...")
    success_count = 0
    fail_count = 0
    
    for site in BANKING_SITES:
        if create_web_asset(site, domain_id):
            success_count += 1
        else:
            fail_count += 1
    
    print()
    print("=" * 60)
    print(f"Import completed: {success_count} succeeded, {fail_count} failed")
    print("=" * 60)

if __name__ == '__main__':
    main()
