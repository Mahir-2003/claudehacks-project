#!/usr/bin/env python3
"""
Generate placeholder icons for Badgers Register Chrome Extension
Run: python3 generate_icons.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Wisconsin red color
WISCONSIN_RED = (197, 5, 12)
WHITE = (255, 255, 255)

def create_icon(size, output_path):
    """Create a simple placeholder icon with 'BR' text"""
    # Create image with red background
    img = Image.new('RGB', (size, size), WISCONSIN_RED)
    draw = ImageDraw.Draw(img)
    
    # Draw white circle in center
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill=WHITE, outline=WISCONSIN_RED, width=2)
    
    # Add 'BR' text (Badgers Register)
    text = "BR"
    
    # Try to use a nice font, fall back to default if not available
    try:
        font_size = size // 2
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Get text bounding box and center it
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]
    
    draw.text((x, y), text, fill=WISCONSIN_RED, font=font)
    
    # Save image
    img.save(output_path, 'PNG')
    print(f"Created: {output_path}")

def main():
    # Create icons directory if it doesn't exist
    icons_dir = 'icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    # Generate all required icon sizes
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)
    
    print("\n✓ All icons generated successfully!")
    print("You can now load the extension in Chrome.")

if __name__ == '__main__':
    main()
