#!/usr/bin/env python3
"""
Neogenesys Cloud Logo Generator
This script creates placeholder branded logo files for the Neogenesys Cloud application.

Requirements:
    pip install Pillow

Usage:
    python3 create_placeholder_logos.py

This will create placeholder logos with the Neogenesys Cloud branding.
For production use, replace these with your actual professionally designed logos.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuration
BRAND_NAME = "Neogenesys"
BRAND_TAGLINE = "Cloud"
PRIMARY_COLOR = "#2563EB"  # Blue
SECONDARY_COLOR = "#FFFFFF"  # White

def create_logo(size, filename, transparent=True):
    """Create a simple branded logo image"""
    # Create image with transparent or colored background
    if transparent:
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    else:
        # Blue background
        img = Image.new('RGBA', (size, size), (37, 99, 235, 255))
    
    draw = ImageDraw.Draw(img)
    
    # Draw a rounded square/circle as logo base
    margin = size // 8
    shape_size = size - 2 * margin
    
    if transparent:
        # Draw filled circle with brand color
        draw.ellipse(
            [margin, margin, margin + shape_size, margin + shape_size],
            fill=(37, 99, 235, 255)
        )
    
    # Try to add text if size is large enough
    if size >= 128:
        try:
            # Try to use a nice font, fall back to default if not available
            font_size = size // 8
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
            except:
                font = ImageFont.load_default()
            
            # Draw text
            text = "NG"  # Initials
            
            # Get text bounding box for centering
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            text_x = (size - text_width) // 2
            text_y = (size - text_height) // 2 - size // 20
            
            draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
        except Exception as e:
            print(f"Could not add text to {filename}: {e}")
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created: {filename}")

def create_svg_logo(filename):
    """Create a simple SVG logo"""
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563EB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#brandGradient)"/>
  
  <!-- Letter N -->
  <path d="M 180 340 L 180 172 L 220 172 L 292 280 L 292 172 L 332 172 L 332 340 L 292 340 L 220 232 L 220 340 Z" 
        fill="white" stroke="none"/>
  
  <!-- Letter G -->
  <path d="M 256 380 A 100 100 0 1 1 256 380" fill="none" stroke="white" stroke-width="8"/>
</svg>'''
    
    with open(filename, 'w') as f:
        f.write(svg_content)
    print(f"Created: {filename}")

def main():
    print("=" * 60)
    print("Neogenesys Cloud Placeholder Logo Generator")
    print("=" * 60)
    print()
    
    # Get the base directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = script_dir
    client_dir = os.path.join(project_root, "jumpserver-client")
    
    # Define paths
    public_logo = os.path.join(client_dir, "public", "logo.png")
    icons_dir = os.path.join(client_dir, "src-tauri", "icons")
    svg_logo = os.path.join(client_dir, "ui", "assets", "logo.svg")
    
    print(f"Creating placeholder logos in: {client_dir}")
    print()
    
    # Create main logo
    print("Creating main application logo...")
    create_logo(512, public_logo, transparent=True)
    print()
    
    # Create icon files
    print("Creating icon files...")
    sizes = {
        "32x32.png": 32,
        "128x128.png": 128,
        "128x128@2x.png": 256,
        "icon.png": 1024,
        "icon-appimage.png": 512,
        "tray-mac.png": 22,
    }
    
    for filename, size in sizes.items():
        filepath = os.path.join(icons_dir, filename)
        create_logo(size, filepath, transparent=True)
    
    print()
    
    # Create SVG logo
    print("Creating SVG logo...")
    create_svg_logo(svg_logo)
    print()
    
    print("=" * 60)
    print("✓ Placeholder logos created successfully!")
    print()
    print("IMPORTANT NOTES:")
    print("- These are placeholder logos for demonstration purposes")
    print("- For production use, replace with professionally designed logos")
    print("- .ico and .icns files need to be created separately using:")
    print("  - Windows: ImageMagick or online converters")
    print("  - macOS: iconutil or CloudConvert")
    print()
    print("See BRANDING-GUIDE.md for detailed instructions")
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("ERROR: Pillow (PIL) is not installed")
        print("Please install it with: pip install Pillow")
        exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        exit(1)
