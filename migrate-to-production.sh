#!/bin/bash

# 🚀 Production Migration Script - Synergy SEA Summit 2025
# Script untuk migrasi dari sandbox ke production

echo "🚀 Starting Production Migration..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📋 Pre-Migration Checklist${NC}"
echo "=================================="

# Check if DOKU production credentials are ready
echo -e "${YELLOW}1. DOKU Production Account Setup${NC}"
echo "   ⚠️  Have you completed DOKU production account setup? (y/n)"
read -r doku_ready

if [ "$doku_ready" != "y" ]; then
    echo -e "${RED}❌ Please complete DOKU production setup first!${NC}"
    echo "   📖 See: DOKU_PRODUCTION_MIGRATION.md"
    exit 1
fi

echo "   ✅ DOKU production account ready"

# Check if custom domain is ready
echo ""
echo -e "${YELLOW}2. Custom Domain Setup${NC}"
echo "   🌐 What is your production domain? (e.g., synergyseakummit.com)"
read -r production_domain

if [ -z "$production_domain" ]; then
    echo -e "${RED}❌ Production domain is required!${NC}"
    exit 1
fi

echo "   ✅ Production domain: $production_domain"

# Get DOKU production credentials
echo ""
echo -e "${YELLOW}3. DOKU Production Credentials${NC}"
echo "   🔑 Enter your DOKU production Client ID:"
read -r doku_client_id

echo "   🔑 Enter your DOKU production Secret Key:"
read -r -s doku_secret_key

echo "   🔑 Enter your DOKU production Shared Key:"
read -r -s doku_shared_key

echo "   ✅ DOKU credentials collected"

# Get database URL
echo ""
echo -e "${YELLOW}4. Production Database${NC}"
echo "   🗄️  Enter your production PostgreSQL URL:"
read -r -s database_url

echo "   ✅ Database URL collected"

# Generate environment variables
echo ""
echo -e "${BLUE}🔧 Generating Production Environment Variables${NC}"
echo "================================================"

cat > .env.production << EOF
# Production Environment Variables
# Generated on $(date)

NODE_ENV=production

# Domain Configuration
NEXT_PUBLIC_BASE_URL=https://$production_domain
NEXT_PUBLIC_PRODUCTION_URL=https://$production_domain

# DOKU Production Configuration
NEXT_PUBLIC_DOKU_BASE_URL=https://api.doku.com
DOKU_CLIENT_ID=$doku_client_id
DOKU_CLIENT_SECRET=$doku_secret_key
DOKU_SHARED_KEY=$doku_shared_key

# Database Production
DATABASE_URL=$database_url
POSTGRES_PRISMA_URL=$database_url
POSTGRES_URL_NON_POOLING=$database_url

# Email Configuration (keep existing)
# GMAIL_USER=your_gmail@gmail.com
# GMAIL_APP_PASSWORD=your_app_password
EOF

echo "   ✅ .env.production file created"

# Generate Vercel deployment commands
echo ""
echo -e "${BLUE}📤 Vercel Deployment Commands${NC}"
echo "=================================="

cat > deploy-production.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying to Production..."

# Set environment variables in Vercel
vercel env add NEXT_PUBLIC_BASE_URL production
vercel env add NEXT_PUBLIC_PRODUCTION_URL production
vercel env add NEXT_PUBLIC_DOKU_BASE_URL production
vercel env add DOKU_CLIENT_ID production
vercel env add DOKU_CLIENT_SECRET production
vercel env add DOKU_SHARED_KEY production
vercel env add DATABASE_URL production
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production

# Deploy to production
vercel --prod

echo "✅ Production deployment complete!"
echo "🔗 Your site: https://your-domain.com"
EOF

chmod +x deploy-production.sh

echo "   ✅ deploy-production.sh script created"

# Generate testing script
echo ""
echo -e "${BLUE}🧪 Testing Script${NC}"
echo "==================="

cat > test-production.sh << EOF
#!/bin/bash

DOMAIN="https://$production_domain"

echo "🧪 Testing Production Environment..."
echo "===================================="

# Test health check
echo "1. Testing health check..."
curl -s "\$DOMAIN/api/database-health" && echo " ✅" || echo " ❌"

# Test payment endpoint
echo "2. Testing payment endpoint..."
curl -s -X POST "\$DOMAIN/api/payment" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "orderId": "TEST-PROD-001"}' && echo " ✅" || echo " ❌"

echo ""
echo "🎯 Manual Tests Required:"
echo "- Register new participant"
echo "- Complete payment flow"
echo "- Verify email delivery"
echo "- Check admin panel"
EOF

chmod +x test-production.sh

echo "   ✅ test-production.sh script created"

# Summary
echo ""
echo -e "${GREEN}🎉 Migration Preparation Complete!${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Review .env.production file"
echo "2. Update DOKU callback URLs in production dashboard:"
echo "   - Success: https://$production_domain/register/success"
echo "   - Callback: https://$production_domain/api/payment/callback"
echo "   - Return: https://$production_domain/api/payment/return"
echo ""
echo "3. Run deployment:"
echo "   ./deploy-production.sh"
echo ""
echo "4. Test production:"
echo "   ./test-production.sh"
echo ""
echo -e "${GREEN}✅ Ready for production migration!${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT: Test with small amount first (Rp 1.000)${NC}"
echo ""
EOF
