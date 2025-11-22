"""
Playwright automation for banking site auto-login
"""

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
import logging

logger = logging.getLogger(__name__)


class BankingAutomation:
    """Automated banking site login using Playwright"""
    
    def __init__(self, banking_site, credentials):
        self.site = banking_site
        self.credentials = credentials
    
    def perform_login(self, kasm_url=None, timeout=30000):
        """
        Perform automated login to banking site
        
        Args:
            kasm_url: Optional Kasm workspace URL to use
            timeout: Timeout in milliseconds
        
        Returns:
            dict with success status and message
        """
        try:
            with sync_playwright() as p:
                # Launch browser
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                )
                
                page = context.new_page()
                
                # Navigate to login page
                login_url = self.site.login_url or self.site.url
                logger.info(f"Navigating to {login_url}")
                page.goto(login_url, timeout=timeout)
                
                # Wait for page to load
                page.wait_for_load_state('networkidle')
                
                # Fill username
                if self.site.username_selector:
                    logger.info("Filling username")
                    page.fill(self.site.username_selector, self.credentials['username'])
                else:
                    # Try common selectors
                    common_username_selectors = [
                        'input[name="username"]',
                        'input[name="user"]',
                        'input[name="email"]',
                        'input[type="email"]',
                        'input[id="username"]',
                        'input[id="user"]'
                    ]
                    for selector in common_username_selectors:
                        try:
                            page.fill(selector, self.credentials['username'], timeout=2000)
                            break
                        except PlaywrightTimeout:
                            continue
                
                # Fill password
                if self.site.password_selector:
                    logger.info("Filling password")
                    page.fill(self.site.password_selector, self.credentials['password'])
                else:
                    # Try common selectors
                    common_password_selectors = [
                        'input[name="password"]',
                        'input[type="password"]',
                        'input[id="password"]',
                        'input[id="pass"]'
                    ]
                    for selector in common_password_selectors:
                        try:
                            page.fill(selector, self.credentials['password'], timeout=2000)
                            break
                        except PlaywrightTimeout:
                            continue
                
                # Submit form
                if self.site.submit_selector:
                    logger.info("Clicking submit button")
                    page.click(self.site.submit_selector)
                else:
                    # Try common selectors or press Enter
                    common_submit_selectors = [
                        'button[type="submit"]',
                        'input[type="submit"]',
                        'button:has-text("Login")',
                        'button:has-text("Sign In")',
                        'button:has-text("Entrar")'
                    ]
                    submitted = False
                    for selector in common_submit_selectors:
                        try:
                            page.click(selector, timeout=2000)
                            submitted = True
                            break
                        except PlaywrightTimeout:
                            continue
                    
                    if not submitted:
                        # Press Enter as last resort
                        page.keyboard.press('Enter')
                
                # Wait for navigation or success indicator
                try:
                    if self.site.success_indicator:
                        page.wait_for_selector(self.site.success_indicator, timeout=timeout)
                    else:
                        page.wait_for_load_state('networkidle', timeout=timeout)
                    
                    # Check if we're still on login page (failed login)
                    current_url = page.url
                    if login_url in current_url and 'error' in current_url.lower():
                        logger.warning("Login appears to have failed - still on login page")
                        browser.close()
                        return {
                            'success': False,
                            'message': 'Login failed - invalid credentials or page error'
                        }
                    
                    # Take screenshot for verification
                    screenshot_path = f"/app/logs/login_{self.site.code}.png"
                    page.screenshot(path=screenshot_path)
                    
                    logger.info(f"Login successful for {self.site.code}")
                    browser.close()
                    
                    return {
                        'success': True,
                        'message': 'Login completed successfully',
                        'screenshot': screenshot_path
                    }
                
                except PlaywrightTimeout:
                    logger.error(f"Timeout waiting for success indicator on {self.site.code}")
                    browser.close()
                    return {
                        'success': False,
                        'message': 'Timeout waiting for login completion'
                    }
        
        except Exception as e:
            logger.error(f"Error during automated login: {str(e)}")
            return {
                'success': False,
                'message': f'Automation error: {str(e)}'
            }
    
    def verify_session(self, page_url):
        """Verify that the user is logged in"""
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(page_url)
                
                # Check for common logout indicators
                logout_indicators = [
                    'a:has-text("Logout")',
                    'a:has-text("Sign Out")',
                    'a:has-text("Cerrar Sesión")',
                    'button:has-text("Logout")'
                ]
                
                for indicator in logout_indicators:
                    try:
                        if page.query_selector(indicator):
                            browser.close()
                            return True
                    except:
                        continue
                
                browser.close()
                return False
        
        except Exception as e:
            logger.error(f"Error verifying session: {str(e)}")
            return False
