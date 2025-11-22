#!/usr/bin/env python3
"""
Inject metadata labels and watermarks into Kasm sessions
"""

import os
import sys
import argparse
import requests
import hmac
import hashlib
import time
from datetime import datetime


class KasmSessionLabeler:
    """Add metadata and watermarks to Kasm sessions"""
    
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
    
    def inject_labels(self, session_id: str, metadata: dict) -> bool:
        """Inject metadata labels into a session"""
        try:
            # Generate watermark text
            watermark = self._generate_watermark(metadata)
            
            data = {
                'kasm_id': session_id,
                'metadata': {
                    'user': metadata.get('user'),
                    'banking_site': metadata.get('banking_site'),
                    'timestamp': metadata.get('timestamp', datetime.utcnow().isoformat()),
                    'session_type': 'banking',
                    'watermark': watermark
                }
            }
            
            result = self._make_request('/update_kasm_metadata', data)
            print(f"✓ Labels injected for session: {session_id}")
            return True
        
        except Exception as e:
            print(f"✗ Failed to inject labels for session {session_id}: {str(e)}")
            return False
    
    def _generate_watermark(self, metadata: dict) -> str:
        """Generate watermark text"""
        parts = []
        
        if 'user' in metadata:
            parts.append(f"User: {metadata['user']}")
        
        if 'banking_site' in metadata:
            parts.append(f"Site: {metadata['banking_site']}")
        
        if 'timestamp' in metadata:
            parts.append(f"Time: {metadata['timestamp']}")
        else:
            parts.append(f"Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        
        return " | ".join(parts)
    
    def enable_watermark(self, session_id: str, watermark_text: str) -> bool:
        """Enable visual watermark on session"""
        try:
            data = {
                'kasm_id': session_id,
                'watermark': {
                    'enabled': True,
                    'text': watermark_text,
                    'position': 'bottom-right',
                    'opacity': 0.5
                }
            }
            
            result = self._make_request('/set_kasm_watermark', data)
            print(f"✓ Watermark enabled for session: {session_id}")
            return True
        
        except Exception as e:
            print(f"✗ Failed to enable watermark for session {session_id}: {str(e)}")
            return False
    
    def get_active_sessions(self, user_email: str = None) -> list:
        """Get active sessions, optionally filtered by user"""
        try:
            data = {}
            if user_email:
                data['user_email'] = user_email
            
            result = self._make_request('/get_kasms', data)
            return result.get('kasms', [])
        
        except Exception as e:
            print(f"✗ Failed to get active sessions: {str(e)}")
            return []


def main():
    parser = argparse.ArgumentParser(description='Inject metadata labels into Kasm sessions')
    parser.add_argument('--kasm-url', required=True, help='KasmWeb URL')
    parser.add_argument('--api-key', required=True, help='Kasm API Key')
    parser.add_argument('--api-secret', required=True, help='Kasm API Secret')
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Inject labels command
    inject_parser = subparsers.add_parser('inject', help='Inject labels into a session')
    inject_parser.add_argument('--session-id', required=True, help='Kasm session ID')
    inject_parser.add_argument('--user', required=True, help='Username')
    inject_parser.add_argument('--banking-site', required=True, help='Banking site code')
    inject_parser.add_argument('--enable-watermark', action='store_true', 
                              help='Enable visual watermark')
    
    # List sessions command
    list_parser = subparsers.add_parser('list', help='List active sessions')
    list_parser.add_argument('--user-email', help='Filter by user email')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Create labeler
    labeler = KasmSessionLabeler(args.kasm_url, args.api_key, args.api_secret)
    
    if args.command == 'inject':
        # Inject labels
        metadata = {
            'user': args.user,
            'banking_site': args.banking_site,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        success = labeler.inject_labels(args.session_id, metadata)
        
        # Optionally enable watermark
        if args.enable_watermark and success:
            watermark = labeler._generate_watermark(metadata)
            labeler.enable_watermark(args.session_id, watermark)
        
        return 0 if success else 1
    
    elif args.command == 'list':
        # List sessions
        sessions = labeler.get_active_sessions(args.user_email)
        
        if sessions:
            print(f"Active sessions ({len(sessions)}):")
            for session in sessions:
                print(f"  - {session['kasm_id']}: {session.get('user_email', 'unknown')} "
                      f"({session.get('workspace_name', 'unknown')})")
        else:
            print("No active sessions found")
        
        return 0


if __name__ == '__main__':
    sys.exit(main())
