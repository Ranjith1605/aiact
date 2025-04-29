import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import CodeRain from '@/components/dashboard/CodeRain';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Function to check if we're running on GitHub Pages
const isGitHubPages = () => {
  return import.meta.env.PROD && window.location.hostname.includes('github.io');
};

export default function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [isGitHubPagesEnv, setIsGitHubPagesEnv] = useState(false);
  const { toast } = useToast();
  
  // Check if we're on GitHub Pages on component mount
  useEffect(() => {
    setIsGitHubPagesEnv(isGitHubPages());
  }, []);
  
  const submitFeedback = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/feedback', { content });
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      setFeedback('');
    },
    onError: (error) => {
      toast({
        title: "Error submitting feedback",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Special handling for GitHub Pages environment
    if (isGitHubPagesEnv) {
      // Since we can't actually send data to a server on GitHub Pages,
      // just log the feedback to console and show a success message
      console.log('[GitHub Pages Demo] Feedback submitted:', feedback);
      toast({
        title: "Feedback submitted (Demo)",
        description: "This is a demo on GitHub Pages. In a real environment, your feedback would be saved to the database.",
      });
      setFeedback('');
      return;
    }
    
    // Normal submission in development or production with backend
    submitFeedback.mutate(feedback);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <CodeRain />
      <Header title="AI Regulation Feedback" />
      
      <main className="px-4 py-6 flex-1 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <section className="mb-8">
            <div className="bg-muted rounded-lg matrix-border p-4">
              <h3 className="font-semibold text-primary mb-3">Your Feedback Matters</h3>
              <p className="text-sm text-primary/80 mb-4">
                Help us improve our AI Regulation Matrix by sharing your thoughts. 
                Your insights will help us evolve this platform to better serve the community.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Textarea 
                    rows={6}
                    className="w-full bg-background text-primary border border-primary/50 rounded px-3 py-2 focus:outline-none focus:border-primary"
                    placeholder="Your feedback on the AI Regulation Matrix..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/80 transition-all matrix-border"
                    disabled={submitFeedback.isPending}
                  >
                    {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-lg font-bold matrix-glow mb-4">Join the AI Regulation Community</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg matrix-border">
                <h4 className="font-semibold text-primary mb-2">Newsletter</h4>
                <p className="text-sm text-primary/80 mb-3">
                  Stay updated with the latest developments in AI regulation from around the world.
                </p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address"
                    className="flex-1 px-3 py-2 bg-background text-primary border border-primary/50 rounded-l focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="button" 
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-r"
                    onClick={() => {
                      if (isGitHubPagesEnv) {
                        console.log('[GitHub Pages Demo] Newsletter subscription');
                        toast({
                          title: "Subscription (Demo)",
                          description: "This is a demo on GitHub Pages. In a real environment, you would be subscribed to the newsletter.",
                        });
                      } else {
                        toast({
                          title: "Newsletter Subscription",
                          description: "Thank you for subscribing to our newsletter!",
                        });
                      }
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg matrix-border">
                <h4 className="font-semibold text-primary mb-2">AI Ethics Forum</h4>
                <p className="text-sm text-primary/80 mb-3">
                  Join discussions with other professionals about the ethical implications of AI regulation.
                </p>
                <button 
                  type="button" 
                  className="w-full bg-muted border border-primary text-primary px-3 py-2 rounded hover:bg-muted/80 transition"
                  onClick={() => {
                    if (isGitHubPagesEnv) {
                      console.log('[GitHub Pages Demo] AI Ethics Forum join request');
                      toast({
                        title: "Forum Join Request (Demo)",
                        description: "This is a demo on GitHub Pages. In a real environment, you would join our AI Ethics Forum.",
                      });
                    } else {
                      toast({
                        title: "Forum Join Request",
                        description: "Your request to join the AI Ethics Forum has been submitted!",
                      });
                    }
                  }}
                >
                  Join the Conversation
                </button>
              </div>
            </div>
          </section>
          
          <section className="matrix-border p-5 rounded-lg bg-muted">
            <h3 className="text-center text-xl font-bold animate-text-glow mb-5">Take the Red Pill</h3>
            <p className="text-center text-primary/90 mb-6">
              "I'm trying to free your mind, Neo. But I can only show you the door. You're the one that has to walk through it."
            </p>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 mx-auto flex items-center justify-center mb-2">
                    <span className="text-2xl">💊</span>
                  </div>
                  <h4 className="text-blue-400 font-medium">Blue Pill</h4>
                  <p className="text-xs text-primary/70 mt-1">
                    Ignorance of AI regulation risks
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto flex items-center justify-center mb-2">
                    <span className="text-2xl">💊</span>
                  </div>
                  <h4 className="text-red-400 font-medium">Red Pill</h4>
                  <p className="text-xs text-primary/70 mt-1">
                    Embrace regulatory compliance
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
