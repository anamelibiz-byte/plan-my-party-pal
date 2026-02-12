#!/bin/bash

echo "🎉 Plan My Party Pal - Deployment Script"
echo "========================================"
echo ""

# Check if hero image exists
if [ ! -f "public/images/hero-party.jpg" ]; then
    echo "⚠️  Warning: Hero image not found at public/images/hero-party.jpg"
    echo "Please add the hero image before deploying."
    echo ""
fi

# Build the app
echo "📦 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "🚀 Deploying to Vercel..."
echo ""
echo "Options:"
echo "1. Deploy to preview (test)"
echo "2. Deploy to production"
echo ""
read -p "Choose option (1 or 2): " option

if [ "$option" = "1" ]; then
    vercel
elif [ "$option" = "2" ]; then
    vercel --prod
else
    echo "Invalid option. Exiting."
    exit 1
fi

echo ""
echo "✨ Deployment complete!"
echo "Don't forget to:"
echo "  1. Set up environment variables in Vercel dashboard"
echo "  2. Configure custom domain (planmypartypal.com)"
echo "  3. Set up Stripe products and webhooks"
echo "  4. Test the live site!"
