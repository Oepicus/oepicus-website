#!/bin/bash

#
# This script finds image files starting with "600" in a source directory,
# converts them to the WebP format, and saves them in a destination directory.
#

# Set the source and destination directories
# Using $HOME instead of ~ for better script portability
SOURCE_DIR="$HOME/Documents/Oepicus/Renders"
DEST_DIR="assets/products"

# Exit if the source directory doesn't exist
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory not found at $SOURCE_DIR"
  exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

echo "Starting conversion..."

# Loop through all files in the source directory starting with "600"
# The glob pattern handles finding the files.
for file_path in "$SOURCE_DIR"/600*; do
  # Check if any file matches the pattern to avoid errors
  if [ -f "$file_path" ]; then
    # Get just the filename from the full path
    filename=$(basename "$file_path")

    # Create the new filename by replacing the old extension with .webp
    # ${filename%.*} removes the extension from the original filename.
    webp_filename="${filename%.*}.webp"
    output_path="$DEST_DIR/$webp_filename"

    # Use cwebp to convert the image.
    # -q 80 sets the quality to 80/100 (a good balance for web images).
    # The command will overwrite the destination file if it already exists.
    echo "Copying '$filename' to '$webp_filename'..."
    cp "$file_path" $DEST_DIR/
    echo "Converting '$filename' to '$webp_filename'..."
    cwebp -q 80 "$file_path" -o "$output_path"
  fi
done

echo "Conversion complete. Files are in $DEST_DIR"

