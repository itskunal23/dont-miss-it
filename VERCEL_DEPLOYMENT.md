# Vercel Deployment Guide

## ✅ Deployment Status

Your application has been deployed to: **https://vercel.com/itskunal23s-projects/dont-miss-it**

## 🔐 Required Environment Variables

**IMPORTANT:** Add these environment variables in your Vercel dashboard to make the app work:

1. Go to: https://vercel.com/itskunal23s-projects/dont-miss-it/settings/environment-variables

2. Add the following variables:

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://frevfwjyyydorwqvwjmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Get your keys from:** https://supabase.com/dashboard/project/frevfwjyyydorwqvwjmo/settings/api

### Stripe (Optional - for payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_monthly_id
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_yearly_id
```

### App Configuration (Required)
```
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

**Replace `your-vercel-app` with your actual Vercel domain**

### Ollama (Optional - for Smart Assist)
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b-instruct
ENABLE_OLLAMA_ASSIST=false
```

## 🚀 After Adding Environment Variables

1. **Redeploy** your application in Vercel dashboard
2. Or run: `vercel --prod --yes` from your local machine

## ✅ Security Notes

- ✅ No API keys or secrets are committed to git
- ✅ All sensitive data is in environment variables
- ✅ `.env*` files are gitignored
- ✅ `ENV_SETUP.md` uses placeholder values only

## 📝 Next Steps

1. Add environment variables in Vercel dashboard
2. Redeploy the application
3. Test the deployment
4. Set up custom domain (optional)
