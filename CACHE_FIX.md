# Fix Browser Cache Issue

## Problem
Chrome browser is showing an old cached version of the landing page (dark blue background, old "QuietDeadline" branding) instead of the new white background version.

## Solutions

### Quick Fix (Immediate)
1. **Hard Refresh Chrome:**
   - Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache:**
   - Open Chrome DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Clear Service Worker Cache:**
   - Open Chrome DevTools (F12)
   - Go to Application tab
   - Click "Service Workers" in left sidebar
   - Click "Unregister" for any registered service workers
   - Go to "Cache Storage" in left sidebar
   - Right-click and delete all caches
   - Refresh the page

### Permanent Fix (Already Applied)
1. ✅ Updated service worker cache version from `v1` to `v2`
2. ✅ Added cache-control headers to prevent aggressive caching
3. ✅ Updated service worker to skip cache for root page

### If Still Not Working

1. **Restart Dev Server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Clear Next.js Cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Use Incognito/Private Window:**
   - Open Chrome in Incognito mode (Ctrl+Shift+N)
   - Navigate to `localhost:3000`
   - This bypasses all cache

4. **Disable Cache in DevTools:**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Check "Disable cache" checkbox
   - Keep DevTools open while browsing

## Why This Happens

- **Browser Cache:** Chrome caches static assets and pages
- **Service Worker:** PWA service worker caches pages for offline use
- **Next.js Static Generation:** Next.js may have pre-rendered the old version
- **CDN/Deployment Cache:** If deployed, Vercel/CDN might be caching

## Prevention

The changes made will:
- Force service worker to update when cache version changes
- Add cache-control headers to prevent aggressive caching
- Skip service worker cache for the root page to always get fresh content
