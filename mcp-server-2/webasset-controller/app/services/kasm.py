"""
KasmWeb client for managing remote browser sessions
"""

import requests
import logging
import hmac
import hashlib
import time

logger = logging.getLogger(__name__)


class KasmClient:
    """Client for interacting with KasmWeb API"""
    
    def __init__(self, base_url, api_key, api_secret):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.api_secret = api_secret
        self.session = requests.Session()
    
    def _generate_signature(self, data):
        """Generate HMAC signature for API request"""
        message = f"{data['timestamp']}{self.api_key}"
        signature = hmac.new(
            self.api_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    def _make_request(self, method, endpoint, data=None):
        """Make authenticated request to Kasm API"""
        url = f"{self.base_url}/api/public{endpoint}"
        
        request_data = data or {}
        request_data['timestamp'] = int(time.time())
        request_data['api_key'] = self.api_key
        request_data['signature'] = self._generate_signature(request_data)
        
        try:
            if method == 'GET':
                response = self.session.get(url, params=request_data)
            elif method == 'POST':
                response = self.session.post(url, json=request_data)
            elif method == 'DELETE':
                response = self.session.delete(url, json=request_data)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Kasm API request failed: {str(e)}")
            raise Exception(f"Kasm API error: {str(e)}")
    
    def create_session(self, user_email, image_id, enable_recording=True):
        """Create a new Kasm workspace session"""
        data = {
            'user_email': user_email,
            'image_id': image_id,
            'enable_recording': enable_recording
        }
        
        response = self._make_request('POST', '/request_kasm', data)
        
        return {
            'session_id': response['kasm_id'],
            'workspace_id': response['workspace_id'],
            'url': response['kasm_url'],
            'recording_path': response.get('recording_path')
        }
    
    def get_session(self, session_id):
        """Get session details"""
        data = {'kasm_id': session_id}
        return self._make_request('GET', '/get_kasm', data)
    
    def terminate_session(self, session_id):
        """Terminate a Kasm session"""
        data = {'kasm_id': session_id}
        return self._make_request('DELETE', '/destroy_kasm', data)
    
    def list_images(self):
        """List available workspace images"""
        return self._make_request('GET', '/get_images')
    
    def get_user_sessions(self, user_email):
        """Get all active sessions for a user"""
        data = {'user_email': user_email}
        return self._make_request('GET', '/get_user_kasms', data)
    
    def get_recordings(self, session_id):
        """Get session recordings"""
        data = {'kasm_id': session_id}
        return self._make_request('GET', '/get_recordings', data)
