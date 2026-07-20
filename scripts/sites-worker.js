// Cloudflare worker entry used by OpenAI Sites. Static files are supplied by
// the platform's ASSETS binding; Vercel continues to use the normal Vite build.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
}
