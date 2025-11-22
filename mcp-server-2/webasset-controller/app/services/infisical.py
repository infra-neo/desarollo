"""
Infisical client for secure credential management
"""

import requests
import logging

logger = logging.getLogger(__name__)


class InfisicalClient:
    """Client for interacting with Infisical secret management"""
    
    def __init__(self, base_url, token):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
    
    def get_secret(self, secret_id, environment='production'):
        """Get a secret from Infisical"""
        try:
            url = f"{self.base_url}/api/v1/secret/{secret_id}"
            params = {'environment': environment}
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return {
                'username': data['secret']['username'],
                'password': data['secret']['password']
            }
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get secret from Infisical: {str(e)}")
            raise Exception("Failed to retrieve credentials")
    
    def list_secrets(self, environment='production', path='/'):
        """List all secrets in a path"""
        try:
            url = f"{self.base_url}/api/v1/secrets"
            params = {
                'environment': environment,
                'path': path
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            return response.json().get('secrets', [])
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to list secrets: {str(e)}")
            return []
    
    def create_secret(self, key, value, environment='production', path='/'):
        """Create a new secret"""
        try:
            url = f"{self.base_url}/api/v1/secret"
            payload = {
                'secretKey': key,
                'secretValue': value,
                'environment': environment,
                'path': path
            }
            
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create secret: {str(e)}")
            raise Exception("Failed to create secret")
    
    def update_secret(self, secret_id, value, environment='production'):
        """Update an existing secret"""
        try:
            url = f"{self.base_url}/api/v1/secret/{secret_id}"
            payload = {
                'secretValue': value,
                'environment': environment
            }
            
            response = self.session.patch(url, json=payload)
            response.raise_for_status()
            
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to update secret: {str(e)}")
            raise Exception("Failed to update secret")
