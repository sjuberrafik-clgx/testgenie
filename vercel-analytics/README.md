# TestGenie Analytics Endpoint

Vercel serverless function for anonymous analytics tracking.

## Deploy

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set env vars in Vercel Dashboard:
   - GITHUB_TOKEN: your_github_pat
   - GITHUB_REPO: sjuberrafik-clgx/testgenie

## Endpoint

POST https://testgenie-analytics.vercel.app/api/analytics
