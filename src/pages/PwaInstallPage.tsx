import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Download, Globe, Smartphone, ArrowLeft, Loader2, QrCode } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

export function PwaInstallPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [pwaData, setPwaData] = useState<{ name: string; short_name: string; start_url: string; theme_color: string; background_color: string; icon_url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pwaData && qrRef.current && !isInstallable && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      const qrCode = new QRCodeStyling({
        width: 150,
        height: 150,
        data: window.location.href,
        margin: 0,
        qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "L" },
        dotsOptions: { color: "#000000", type: "square" },
        backgroundOptions: { color: "#ffffff" }
      });
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
    }
  }, [pwaData, isInstallable]);

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone || 
             document.referrer.includes('android-app://');
    };
    setIsStandalone(checkStandalone());

    // Fetch PWA data from URL query param or localStorage (fallback)
    let dataStr = null;
    const dataParam = searchParams.get('data');
    const n = searchParams.get('n');
    const u = searchParams.get('u');
    const i = searchParams.get('i');
    const c = searchParams.get('c');
    
    if (n && u && i) {
      dataStr = JSON.stringify({
        name: n,
        short_name: n,
        start_url: u,
        theme_color: c || '#3b82f6',
        background_color: '#ffffff',
        icon_url: i
      });
    } else if (dataParam) {
      try {
        dataStr = decodeURIComponent(atob(dataParam));
      } catch (e) {
        console.error("Failed to decode URL data", e);
      }
    } else if (id) {
      dataStr = localStorage.getItem(`pwabuilder_${id}`);
    }

    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        
        // Normalize old data format to new format
        const normalizedData = {
          name: parsed.name || parsed.title || 'My App',
          short_name: parsed.short_name || parsed.title || 'App',
          start_url: parsed.start_url || parsed.url || window.location.href,
          theme_color: parsed.theme_color || '#3b82f6',
          background_color: parsed.background_color || '#ffffff',
          icon_url: parsed.icon_url || parsed.icon || ''
        };
        
        setPwaData(normalizedData);
        
        // Dynamically update document title and favicon
        document.title = `Install ${normalizedData.name}`;
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = normalizedData.icon_url;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = normalizedData.icon_url;
          document.head.appendChild(newLink);
        }

        // Generate dynamic manifest.json
        const manifest = {
          name: normalizedData.name,
          short_name: normalizedData.short_name,
          start_url: window.location.pathname + window.location.search,
          display: 'standalone',
          background_color: normalizedData.background_color,
          theme_color: normalizedData.theme_color,
          icons: [
            {
              src: normalizedData.icon_url,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        };

        const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        
        let manifestLink = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
        if (!manifestLink) {
          manifestLink = document.createElement('link');
          manifestLink.rel = 'manifest';
          document.head.appendChild(manifestLink);
        }
        manifestLink.href = manifestUrl;

        // Register a generic service worker to satisfy PWA requirements
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            (err) => {
              console.log('ServiceWorker registration failed: ', err);
            }
          );
        }
      } catch (e) {
        console.error("Failed to parse PWA data", e);
      }
    }
    setIsLoading(false);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [id]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt is available, generate an HTML shortcut file
      if (pwaData?.start_url) {
        const shortcutContent = `<!DOCTYPE html>
<html>
<head>
    <title>${pwaData.name}</title>
    <link rel="icon" href="${pwaData.icon_url}">
    <meta http-equiv="refresh" content="0; url=${pwaData.start_url}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="${pwaData.name}">
    <link rel="apple-touch-icon" href="${pwaData.icon_url}">
</head>
<body>
    <script>window.location.href = "${pwaData.start_url}";</script>
    <p>Redirecting to <a href="${pwaData.start_url}">${pwaData.name}</a>...</p>
</body>
</html>`;
        const blob = new Blob([shortcutContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pwaData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#111827] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!pwaData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#111827] flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-[#181a22] p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full">
          <Globe className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">App Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            The app you are looking for does not exist or has expired.
          </p>
          <button
            onClick={() => navigate('/convert-website-to-app')}
            className="flex items-center justify-center w-full gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Builder
          </button>
        </div>
      </div>
    );
  }

  if (isStandalone) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-white dark:bg-black">
        <iframe 
          src={pwaData.start_url} 
          className="w-full h-full border-none"
          title={pwaData.name}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#111827] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#181a22] p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mx-auto w-32 h-32 mb-6">
          <img 
            src={pwaData.icon_url} 
            alt={`${pwaData.name} icon`} 
            className="w-full h-full object-cover rounded-3xl shadow-md border border-zinc-100 dark:border-zinc-800"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-[#181a22]">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {pwaData.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 truncate px-4">
          {pwaData.start_url}
        </p>

        <button
          onClick={handleInstallClick}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          <Download className="w-5 h-5" />
          {isInstallable ? 'Install App' : 'Download Shortcut'}
        </button>

        {!isInstallable && (
          <div className="mt-8 text-left bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">How to install manually:</h3>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 mb-4">
              <li><strong>iOS (Safari):</strong> Tap the Share button <span className="inline-block border border-zinc-300 dark:border-zinc-600 rounded px-1">↑</span> and select "Add to Home Screen".</li>
              <li><strong>Android (Chrome):</strong> Tap the menu <span className="inline-block border border-zinc-300 dark:border-zinc-600 rounded px-1">⋮</span> and select "Install app" or "Add to Home screen".</li>
            </ul>
            
            {!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 text-center">
                <div className="flex items-center justify-center mb-2 text-zinc-900 dark:text-zinc-50">
                  <QrCode className="w-4 h-4 mr-2" />
                  <h4 className="text-sm font-semibold">Scan to install on phone</h4>
                </div>
                <div className="flex justify-center bg-white p-2 rounded-lg inline-block mx-auto border border-zinc-100 dark:border-zinc-800">
                  <div ref={qrRef} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/convert-website-to-app')}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
        >
          Build your own app
        </button>
      </div>
    </div>
  );
}
