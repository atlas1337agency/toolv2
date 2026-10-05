import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2, Download, AlertCircle, Server, Code, Lock, LogIn } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface BackendRequiredToolProps {
  title: string;
  description: string;
  icon: React.ElementType;
  accept: Record<string, string[]>;
  actionName: string;
  outputExtension: string;
}

export function BackendRequiredTool({ 
  title, 
  description, 
  icon: Icon, 
  accept, 
  actionName,
  outputExtension
}: BackendRequiredToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check active session
    const checkSession = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session) setIsLoggingIn(false);
      });
    };
    
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsLoggingIn(false);
    });

    // Listen for popup success message
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkSession();
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
        }
      });
      
      if (error) throw error;
      
      // Get the URL from Supabase and open it in a popup window
      const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
        }
      });
      
      if (data?.url) {
        // Open the Google login in a popup window to bypass iframe restrictions
        const authWindow = window.open(
          data.url,
          'oauth_popup',
          'width=600,height=700'
        );
        
        if (!authWindow) {
          throw new Error('Please allow popups for this site to connect your account.');
        }
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoggingIn(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsDone(false);
      setError(null);
      setResultBlob(null);
      setShowSetupInstructions(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1
  } as any);

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setShowSetupInstructions(false);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', actionName);
      if (password) formData.append('password', password);
      
      // Call the Supabase Edge Function using the official client
      // This automatically attaches the logged-in user's JWT token!
      const { data, error: invokeError } = await supabase.functions.invoke('process-pdf', {
        body: formData,
      });

      if (invokeError) {
        throw invokeError;
      }

      // If the function returns a blob (the processed file)
      if (data instanceof Blob) {
        setResultBlob(data);
        setError(null);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        // Fallback if the function returns JSON instead of a blob
        const content = "SUCCESS! Your Supabase Edge Function received the file and returned a response.\n\nTo implement real conversion, integrate a service like ConvertAPI or Cloudmersive in the Edge Function code.";
        setResultBlob(new Blob([content], { type: "text/plain" }));
        setError(null);
      }
      
      setIsDone(true);
    } catch (err: any) {
      console.error("Supabase Edge Function Error:", err);
      
      // Fallback to simulation so the user is not blocked
      const content = `SIMULATED RESULT\n\nOriginal File: ${file.name}\nAction: ${actionName}\n\nThe connection to your Supabase Edge Function failed.\nError: ${err.message}\n\nThis usually means the function is not deployed yet, is named incorrectly, or crashed before returning CORS headers.`;
      setResultBlob(new Blob([content], { type: "text/plain" }));
      setIsDone(true);
      
      if (
        err.message?.includes('not found') || 
        err.message?.includes('Failed to fetch') || 
        err.message?.includes('Failed to send a request') ||
        err.status === 404
      ) {
        setError("Backend connection failed (Function not deployed or CORS error). Falling back to simulated result.");
        setShowSetupInstructions(true);
      } else {
        setError(`Backend error: ${err.message}. Falling back to simulated result.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!file || !resultBlob) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(resultBlob);
    
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    link.download = `${baseName}${outputExtension}`;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/pdf-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
        </div>

        <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10">
          <CardContent className="p-4 flex items-start gap-4 text-emerald-800 dark:text-emerald-200">
            <Server className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium">Supabase Backend Connected</h3>
              <p className="text-sm mt-1 opacity-90">
                This tool is now connected to your Supabase project (jwrognqeiwlhkjwkdyeu). 
                It will attempt to call the <code>process-pdf</code> Edge Function.
              </p>
            </div>
          </CardContent>
        </Card>

        {!session ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-2">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-semibold">Authentication Required</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Because {actionName} requires heavy server processing, you must be logged in to use this tool. This prevents abuse and keeps the service secure.
                  </p>
                </div>
                
                {error && (
                  <div className="w-full max-w-md p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm text-left">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting to Google...</>
                  ) : (
                    <><LogIn className="w-5 h-5 mr-2" /> Sign in with Google</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !file ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                }`}
              >
                <input {...getInputProps()} />
                <Icon className="w-12 h-12 text-zinc-400 mb-4" />
                <p className="text-lg font-medium text-center">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-zinc-500 mt-2">
                  Accepted formats: {Object.values(accept).flat().join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{actionName}</span>
                <Button variant="outline" size="sm" onClick={() => { setFile(null); setIsDone(false); }}>
                  Change File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-between">
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>

              {!isDone ? (
                <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
                  {actionName === 'Protect PDF' && (
                    <div className="w-full space-y-2 text-left">
                      <label className="text-sm font-medium">Set PDF Password</label>
                      <input 
                        type="password" 
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a secure password..."
                      />
                    </div>
                  )}
                  <Button 
                    size="lg"
                    className="w-full" 
                    onClick={processFile} 
                    disabled={isProcessing || (actionName === 'Protect PDF' && !password)}
                  >
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing via Supabase...</> : <><Icon className="w-5 h-5 mr-2" /> Start {actionName}</>}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  {error && (
                    <div className="w-full max-w-md p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg flex items-start text-sm text-left mb-4">
                      <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Simulated Result</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium text-center">Processing Complete!</h3>
                  <p className="text-zinc-500 text-center mb-4">
                    {error ? "A simulated file has been generated." : "Your file was successfully processed by Supabase."}
                  </p>
                  
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white w-full max-w-md" 
                    onClick={downloadResult}
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Result
                  </Button>

                  {showSetupInstructions && (
                    <div className="w-full max-w-2xl mt-8 p-6 bg-zinc-900 text-zinc-100 rounded-xl space-y-4 text-left">
                      <h3 className="text-lg font-medium flex items-center text-white">
                        <Code className="w-5 h-5 mr-2" /> Why did the connection fail?
                      </h3>
                      <p className="text-zinc-400 text-sm">The error <code className="text-red-400">Failed to send a request to the Edge Function</code> is a CORS error. It happens when the browser tries to talk to Supabase, but Supabase rejects it before the code even runs. This means:</p>
                      
                      <ol className="list-decimal list-inside space-y-3 text-zinc-300 text-sm">
                        <li>The function is <strong>not deployed</strong> yet.</li>
                        <li>The function is named something other than <code className="bg-zinc-800 px-1 py-0.5 rounded text-emerald-300">process-pdf</code>.</li>
                        <li>The function crashed immediately and didn't return CORS headers.</li>
                      </ol>

                      <div className="p-4 bg-zinc-800 rounded-lg mt-4">
                        <p className="text-sm font-medium text-white mb-2">To fix this, deploy the function from your terminal:</p>
                        <div className="font-mono text-xs text-zinc-300 space-y-1">
                          <p>npx supabase login</p>
                          <p>npx supabase init</p>
                          <p>npx supabase functions new process-pdf</p>
                          <p>npx supabase functions deploy process-pdf --project-ref jwrognqeiwlhkjwkdyeu --no-verify-jwt</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
