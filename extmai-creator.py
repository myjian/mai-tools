# https://poe.com/s/etJ1yiSzy66HUJGw4tVC
# minor corrections applied

# manifest V3 compliance impossible unless userscript.js is the main script.
# currently userscript.js copies  userscript functionality and loads script from external sources.
# this would involve author effort, or I need to copy the script from him to include here.

import os
import json
import shutil
import zipfile
from PIL import Image

# Create the extension directory
extension_dir = 'extension_creation'
os.makedirs(extension_dir, exist_ok=True)

# Copy the userscript.js file to the extension directory
shutil.copy('userscript.js', extension_dir)

# Scale and export the icons
icon_sizes = {
    "16": (16, 16),
    "32": (32, 32),
    "48": (48, 48),
    "128": (128, 128)
}

for size, dimensions in icon_sizes.items():
    icon_path = 'apple-touch-icon.png'
    icon = Image.open(icon_path)
    icon = icon.resize(dimensions)
    icon.save(os.path.join(extension_dir, f'icon{size}.png'))

# Create the manifest.json file
manifest_data = {
    "name": "extmai tools",
    "version": "2.0.2.0",
    "manifest_version": 2,
    "permissions": [
        "activeTab"
    ],
    "icons": {
        "16": "icon16.png",
        "32": "icon32.png",
        "48": "icon48.png",
        "128": "icon128.png"
    },
    "content_scripts": [
        {
            "matches": [
                "https://maimaidx-eng.com/*",   # "https://example.com/*"
                "https://maimaidx.jp/*"
            ],
            "js": [
                "userscript.js"
            ]
        }
    ]
}

manifest_path = os.path.join(extension_dir, 'manifest.json')
with open(manifest_path, 'w') as manifest_file:
    json.dump(manifest_data, manifest_file, indent=2)

# Create a ZIP file of the extension directory
extension_zip = 'extension_creation.zip'
with zipfile.ZipFile(extension_zip, 'w') as zipf:
    for root, dirs, files in os.walk(extension_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = file_path.replace(extension_dir + os.sep, '')
            zipf.write(file_path, arcname)

print(f"Extension packaged successfully as '{extension_zip}'.")
