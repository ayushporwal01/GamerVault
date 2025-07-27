# Background Image Optimization Guide

Your current `retro-bg.jpg` is 1.47 MB, which is causing slow loading times. Here are several ways to optimize it:

## Option 1: Online Compression (Recommended - Easiest)

1. Go to https://squoosh.app/ or https://tinypng.com/
2. Upload your `public/retro-bg.jpg` file
3. Try these settings:
   - **WebP format** with 75-85% quality (should reduce size by 60-80%)
   - **JPEG format** with 80-85% quality (should reduce size by 40-60%)
4. Download the optimized version
5. Save as `public/retro-bg.webp` (for WebP) or replace the existing JPG

## Option 2: Using PowerShell with ImageMagick (If you have it installed)

```powershell
# Install ImageMagick first: https://imagemagick.org/script/download.php#windows
# Then run:
magick "public/retro-bg.jpg" -quality 80 -resize 1920x1080^ "public/retro-bg-optimized.jpg"
magick "public/retro-bg.jpg" -quality 80 -resize 1920x1080^ "public/retro-bg.webp"
```

## Option 3: Manual Resize (If you have image editing software)

1. Open the image in any image editor (Paint.NET, GIMP, Photoshop, etc.)
2. Resize to maximum 1920x1080 (most users won't need larger)
3. Save as JPEG with 80-85% quality
4. Save as WebP with 80% quality (if supported)

## Expected Results

- **Original**: 1.47 MB
- **Optimized JPEG**: ~400-600 KB (60-70% smaller)
- **Optimized WebP**: ~200-400 KB (70-80% smaller)

## After Optimization

1. Place the optimized image(s) in your `public/` folder
2. The code will automatically try WebP first, then fallback to JPEG
3. Your background should load 3-5x faster!

## Additional Performance Tips

- The current code now includes:
  ✅ Image preloading
  ✅ Progressive loading (WebP → JPEG fallback)
  ✅ Smooth transition with gradient fallback
  ✅ HTML preload hints

## Troubleshooting

If you still experience slow loading:
1. Check your internet connection
2. Try clearing browser cache (Ctrl+F5)
3. Reduce image quality further if needed
4. Consider using a solid color or simple gradient background
