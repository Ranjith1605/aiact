import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Function to determine if we're running on GitHub Pages
const isGitHubPages = () => {
  return import.meta.env.PROD && window.location.hostname.includes('github.io');
};

// Function to get the base path for requests
const getBasePath = () => {
  if (isGitHubPages()) {
    return '/ai-regulations-matrix';
  }
  return '';
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Handle GitHub Pages deployment
  if (isGitHubPages() && method === 'GET') {
    // Transform API path to static JSON file path
    const staticPath = url.replace('/api/', '/data/') + '.json';
    const basePath = getBasePath();
    const fullPath = `${basePath}${staticPath}`;
    
    const res = await fetch(fullPath);
    await throwIfResNotOk(res);
    return res;
  }
  
  // For non-GET methods in GitHub Pages, console log the data (since we can't modify the server)
  if (isGitHubPages() && method !== 'GET') {
    console.log(`[GitHub Pages] ${method} request to ${url} with data:`, data);
    // Return a fake Response for GitHub Pages
    return new Response(JSON.stringify({ success: true, message: 'Operation simulated in GitHub Pages' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Normal API request
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const path = queryKey[0] as string;
    
    // Check if we're on GitHub Pages and modify the fetch accordingly
    if (isGitHubPages()) {
      try {
        // If we're in GitHub Pages environment, use the static JSON files
        const staticPath = path.replace('/api/', '/data/') + '.json';
        const basePath = getBasePath();
        const fullPath = `${basePath}${staticPath}`;
        
        const res = await fetch(fullPath);
        await throwIfResNotOk(res);
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch from static JSON:', error);
        throw error;
      }
    }
    
    // Normal API fetch for development/production with backend
    const res = await fetch(path, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
