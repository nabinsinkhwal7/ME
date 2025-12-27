#!/bin/bash

echo "🚀 Cache Busting Tool for Static Sites"
echo ""

# Generate timestamp version
timestamp=$(date +%Y%m%d%H%M%S)
echo "Generated version: $timestamp"
echo ""

# Update index.html
if [ -f "index.html" ]; then
    echo "✅ Updating index.html..."
    sed -i.bak "s/styles\.css?v=[^\"']*/styles.css?v=$timestamp/g" index.html
    sed -i.bak "s/script\.js?v=[^\"']*/script.js?v=$timestamp/g" index.html
    sed -i.bak "s/styles\.css\"/styles.css?v=$timestamp\"/g" index.html
    sed -i.bak "s/script\.js\"/script.js?v=$timestamp\"/g" index.html
    rm index.html.bak 2>/dev/null
else
    echo "⚠️  index.html not found"
fi

# Update personal.html if it exists
if [ -f "personal.html" ]; then
    echo "✅ Updating personal.html..."
    sed -i.bak "s/styles\.css?v=[^\"']*/styles.css?v=$timestamp/g" personal.html
    sed -i.bak "s/script\.js?v=[^\"']*/script.js?v=$timestamp/g" personal.html
    sed -i.bak "s/styles\.css\"/styles.css?v=$timestamp\"/g" personal.html
    sed -i.bak "s/script\.js\"/script.js?v=$timestamp\"/g" personal.html
    rm personal.html.bak 2>/dev/null
else
    echo "ℹ️  personal.html not found, skipping..."
fi

echo ""
echo "✨ Cache busting complete!"
echo ""
echo "📝 Next steps:"
echo "1. Upload your updated HTML files to your server"
echo "2. Clear any CDN cache if you're using one"
echo "3. Test in an incognito/private browser window"
