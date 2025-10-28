#!/bin/bash
# Generate PWA icons from source image using ImageMagick or sips (macOS built-in)

SOURCE_IMAGE="../transparentfireshield.png"
OUTPUT_DIR="../public"

# PWA icon sizes required
SIZES=(72 96 128 144 152 192 384 512)

echo "🔥 Generating PWA icons from $SOURCE_IMAGE..."

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick (convert)"
    TOOL="imagemagick"
elif command -v sips &> /dev/null; then
    echo "✅ Using sips (macOS built-in)"
    TOOL="sips"
else
    echo "❌ Error: Neither ImageMagick nor sips found."
    echo "   Install ImageMagick: brew install imagemagick"
    exit 1
fi

# Generate each icon size
for size in "${SIZES[@]}"; do
    output_file="$OUTPUT_DIR/icon-${size}x${size}.png"
    
    if [ "$TOOL" = "imagemagick" ]; then
        convert "$SOURCE_IMAGE" -resize ${size}x${size} "$output_file"
    else
        # sips (macOS)
        sips -z $size $size "$SOURCE_IMAGE" --out "$output_file" &> /dev/null
    fi
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Generated: icon-${size}x${size}.png"
    else
        echo "  ❌ Failed: icon-${size}x${size}.png"
    fi
done

echo "🎉 Icon generation complete!"
echo ""
echo "Generated files:"
ls -lh $OUTPUT_DIR/icon-*.png
