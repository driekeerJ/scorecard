// Worker script voor Cloudflare deployment
interface Env {
  ASSETS: any; // Cloudflare Assets binding
}

interface ApiResponse {
  message: string;
  timestamp: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Voor API routes kun je hier custom logic toevoegen
    if (url.pathname.startsWith("/api/")) {
      // Voorbeeld API route
      const response: ApiResponse = { 
        message: "Scorecard API",
        timestamp: new Date().toISOString()
      };
      
      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Serve static assets (React app)
    return env.ASSETS.fetch(request);
  },
};
