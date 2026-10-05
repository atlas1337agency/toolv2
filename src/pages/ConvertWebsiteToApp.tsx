import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, Upload, Info, Check, AlertCircle, Loader2, CheckCircle, X, Download, QrCode, Globe, LayoutTemplate, ArrowRight, Search, Wand2 } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

export function ConvertWebsiteToApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pwa' | 'native'>('pwa');

  // Native App State
  const [appName, setAppName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [packageName, setPackageName] = useState('');
  const [versionCode, setVersionCode] = useState('1');
  const [versionName, setVersionName] = useState('1.0');
  const [mainColor, setMainColor] = useState('#3b82f6');
  const [keystore, setKeystore] = useState('generate');
  
  const [splashScreen, setSplashScreen] = useState(true);
  const [splashBgColor, setSplashBgColor] = useState('#ffffff');
  
  const [pullToRefresh, setPullToRefresh] = useState(false);
  const [confirmOnExit, setConfirmOnExit] = useState(false);
  const [progressBar, setProgressBar] = useState('none');
  
  const [admob, setAdmob] = useState('not_required');
  const [admobAppId, setAdmobAppId] = useState('');
  const [bannerAdUnitId, setBannerAdUnitId] = useState('');
  const [interstitialAdUnitId, setInterstitialAdUnitId] = useState('');
  const [interstitialAdInterval, setInterstitialAdInterval] = useState('');
  
  const [pushNotifications, setPushNotifications] = useState('none');
  const [oneSignalAppId, setOneSignalAppId] = useState('');

  const [appIcon, setAppIcon] = useState<File | null>(null);
  const [appIconPreview, setAppIconPreview] = useState<string | null>(null);
  
  const [splashImageFile, setSplashImageFile] = useState<File | null>(null);
  const [splashImagePreview, setSplashImagePreview] = useState<string | null>(null);
  
  const [googleServicesFile, setGoogleServicesFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // PWA State
  const [pwaUrl, setPwaUrl] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanProgress, setScanProgress] = useState<string>('');
  const [pwaManifest, setPwaManifest] = useState({
    name: '',
    short_name: '',
    start_url: '',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icon_url: ''
  });
  const [isBuildingPwa, setIsBuildingPwa] = useState(false);
  const [pwaSuccessLink, setPwaSuccessLink] = useState<string | null>(null);

  const handleScanUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwaUrl) return;

    let targetUrl = pwaUrl;
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
      setPwaUrl(targetUrl);
    }

    setScanStatus('scanning');
    setScanProgress('Connecting to website...');

    try {
      // Use a CORS proxy to fetch the website HTML
      setScanProgress('Fetching website data...');
      
      let html = '';
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch website');
        const data = await response.json();
        html = data.contents;
      } catch (e) {
        // Fallback proxy
        const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch website');
        html = await response.text();
      }
      
      setScanProgress('Analyzing HTML and Manifest...');
      
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      let name = doc.title || '';
      let theme_color = '#ffffff';
      let icon_url = '';
      let manifest_url = '';

      // Extract theme color
      const themeMeta = doc.querySelector('meta[name="theme-color"]');
      if (themeMeta) theme_color = themeMeta.getAttribute('content') || '#ffffff';

      // Extract icon
      const appleTouchIcon = doc.querySelector('link[rel="apple-touch-icon"]');
      const icon = doc.querySelector('link[rel="icon"]');
      const shortcutIcon = doc.querySelector('link[rel="shortcut icon"]');
      
      if (appleTouchIcon) icon_url = appleTouchIcon.getAttribute('href') || '';
      else if (icon) icon_url = icon.getAttribute('href') || '';
      else if (shortcutIcon) icon_url = shortcutIcon.getAttribute('href') || '';

      // Resolve relative icon URL
      if (icon_url && !icon_url.startsWith('http') && !icon_url.startsWith('data:')) {
        try {
          icon_url = new URL(icon_url, targetUrl).href;
        } catch (e) {
          icon_url = `${targetUrl.replace(/\/$/, '')}/${icon_url.replace(/^\//, '')}`;
        }
      }

      // Extract manifest
      const manifestLink = doc.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifest_url = manifestLink.getAttribute('href') || '';
        if (manifest_url && !manifest_url.startsWith('http')) {
          try {
            manifest_url = new URL(manifest_url, targetUrl).href;
          } catch (e) {
            manifest_url = `${targetUrl.replace(/\/$/, '')}/${manifest_url.replace(/^\//, '')}`;
          }
        }
      }

      // Try to fetch manifest if it exists
      if (manifest_url) {
        setScanProgress('Fetching Web App Manifest...');
        try {
          let manifestJson = null;
          try {
            const manifestRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(manifest_url)}`);
            if (manifestRes.ok) {
              const manifestData = await manifestRes.json();
              manifestJson = JSON.parse(manifestData.contents);
            }
          } catch (e) {
            const manifestRes = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(manifest_url)}`);
            if (manifestRes.ok) {
              manifestJson = await manifestRes.json();
            }
          }

          if (manifestJson) {
            if (manifestJson.name) name = manifestJson.name;
            if (manifestJson.theme_color) theme_color = manifestJson.theme_color;
            if (manifestJson.icons && manifestJson.icons.length > 0) {
              let mIcon = manifestJson.icons[manifestJson.icons.length - 1].src; // Get largest icon
              if (mIcon && !mIcon.startsWith('http') && !mIcon.startsWith('data:')) {
                try {
                  mIcon = new URL(mIcon, manifest_url).href;
                } catch (e) {
                  mIcon = `${targetUrl.replace(/\/$/, '')}/${mIcon.replace(/^\//, '')}`;
                }
              }
              icon_url = mIcon;
            }
          }
        } catch (e) {
          console.warn('Failed to fetch manifest', e);
        }
      }

      // Fallback icon if none found
      if (!icon_url) {
        icon_url = `${targetUrl.replace(/\/$/, '')}/favicon.ico`;
      }

      setPwaManifest({
        name: name || 'My App',
        short_name: name || 'App',
        start_url: targetUrl,
        theme_color: theme_color,
        background_color: '#ffffff',
        icon_url: icon_url
      });

      setScanStatus('success');
    } catch (error) {
      console.error('Scan error:', error);
      // Fallback to manual entry
      setPwaManifest({
        name: 'My App',
        short_name: 'App',
        start_url: targetUrl,
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icon_url: `${targetUrl.replace(/\/$/, '')}/favicon.ico`
      });
      setScanStatus('success'); // Still proceed to manual entry
    }
  };

  const handleBuildPwa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwaManifest.name || !pwaManifest.start_url || !pwaManifest.icon_url) {
      alert("Please ensure App Name, URL, and Icon URL are filled.");
      return;
    }

    setIsBuildingPwa(true);
    
    setTimeout(() => {
      const params = new URLSearchParams({
        n: pwaManifest.name,
        u: pwaManifest.start_url,
        i: pwaManifest.icon_url,
        c: pwaManifest.theme_color,
      });
      
      setPwaSuccessLink(`${window.location.origin}/pwa?${params.toString()}`);
      setIsBuildingPwa(false);
    }, 1000);
  };

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    location: false,
    storage: false,
  });

  const handlePermissionChange = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);
    
    // Simulate build process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSubmitting(false);
          setIsSuccess(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleDownload = (type: 'apk' | 'aab') => {
    // Create a dummy file to simulate download
    const content = `This is a simulated ${type.toUpperCase()} file for ${appName}.`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.replace(/\s+/g, '_').toLowerCase()}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const qrRef = useRef<HTMLDivElement>(null);
  const pwaQrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess && qrRef.current) {
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: websiteUrl,
        margin: 0,
        qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "H" },
        dotsOptions: { color: "#000000", type: "square" },
        backgroundOptions: { color: "#ffffff" }
      });
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
    }
  }, [isSuccess, websiteUrl]);

  useEffect(() => {
    if (pwaSuccessLink && pwaQrRef.current) {
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: pwaSuccessLink,
        margin: 0,
        qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "L" },
        dotsOptions: { color: "#000000", type: "square" },
        backgroundOptions: { color: "#ffffff" }
      });
      pwaQrRef.current.innerHTML = "";
      qrCode.append(pwaQrRef.current);
    }
  }, [pwaSuccessLink]);

  if (isSuccess) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-[#111827]/50">
        <div className="mx-auto max-w-3xl text-center space-y-8 py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">App Generated Successfully!</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Your website <strong>{websiteUrl}</strong> has been successfully converted into an Android app. The APK and AAB files are ready for download.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => {
                alert("Note: This is a frontend prototype. Generating a real, installable Android APK requires a backend build server (like Android Studio or cloud build tools). The downloaded file will be a placeholder.");
                handleDownload('apk');
              }}
              className="flex items-center justify-center w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download APK
            </button>
            <button 
              onClick={() => {
                alert("Note: This is a frontend prototype. Generating a real, installable Android AAB requires a backend build server. The downloaded file will be a placeholder.");
                handleDownload('aab');
              }}
              className="flex items-center justify-center w-full sm:w-auto rounded-xl bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download AAB
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-2xl mx-auto text-left flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Prototype Notice:</strong> Because this app is running entirely in your browser, it cannot compile a real Android application. The downloaded APK/AAB files are simulated placeholders. To generate real apps, you would need to connect this UI to a backend build service.
            </p>
          </div>

          <div className="mt-12 p-8 bg-white dark:bg-[#181a22] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4 text-zinc-900 dark:text-zinc-50">
              <QrCode className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Scan to Open Website</h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Scan this QR code with your mobile device to open <strong>{websiteUrl}</strong> directly on your phone.
            </p>
            <div className="flex justify-center bg-white p-4 rounded-xl inline-block mx-auto border border-zinc-100 dark:border-zinc-800">
              <div ref={qrRef} />
            </div>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => {
                setIsSuccess(false);
                setProgress(0);
              }} 
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Create Another App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-[#111827]/50">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <Smartphone className="h-8 w-8 text-blue-500" />
            Convert Website To App
          </h1>
          <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800/30">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Convert Your Website into an App
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Choose between creating a Progressive Web App (PWA) for instant installation without app stores, or a Native Android App (.apk/.aab) for Google Play.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 p-1">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === 'pwa'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-[#1e2330] dark:text-blue-400'
                : 'text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-[#374151]/50 dark:hover:text-zinc-50'
            }`}
          >
            <Globe className="h-4 w-4" />
            Website To PWA
          </button>
          <button
            onClick={() => setActiveTab('native')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === 'native'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-[#1e2330] dark:text-blue-400'
                : 'text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-[#374151]/50 dark:hover:text-zinc-50'
            }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            Native Android App
          </button>
        </div>

        {activeTab === 'pwa' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {pwaSuccessLink ? (
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-8 text-center dark:border-green-900/30 dark:bg-green-900/10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Your PWA is Ready!</h3>
                <p className="mb-8 text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  Your Progressive Web App has been successfully generated. You can now install it directly on your device.
                </p>
                
                <div className="bg-white dark:bg-[#181a22] rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 max-w-sm mx-auto mb-8">
                  <div className="flex justify-center mb-4">
                    <div ref={pwaQrRef} />
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Scan this QR code with your phone camera to open and install the app.
                  </p>
                  <a
                    href={pwaSuccessLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Open Install Link <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    setPwaSuccessLink(null);
                    setPwaManifest({
                      name: '',
                      short_name: '',
                      start_url: '',
                      theme_color: '#ffffff',
                      background_color: '#ffffff',
                      icon_url: ''
                    });
                    setPwaUrl('');
                    setScanStatus('idle');
                  }}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
                >
                  Create Another PWA
                </button>
              </div>
            ) : scanStatus === 'idle' || scanStatus === 'scanning' ? (
              <form onSubmit={handleScanUrl} className="space-y-8">
                <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      Create Progressive Web App (PWA)
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Turn your website into an installable app instantly. Enter your URL to scan for app details.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={pwaUrl}
                      onChange={(e) => setPwaUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={scanStatus === 'scanning'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                  >
                    {scanStatus === 'scanning' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {scanProgress}
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Scan Website
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBuildPwa} className="space-y-8">
                <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      Review & Edit App Details
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      We've extracted these details from your website. You can edit them before building.
                    </p>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        App Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pwaManifest.name}
                        onChange={(e) => setPwaManifest({...pwaManifest, name: e.target.value})}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Short Name
                      </label>
                      <input
                        type="text"
                        value={pwaManifest.short_name}
                        onChange={(e) => setPwaManifest({...pwaManifest, short_name: e.target.value})}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Start URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={pwaManifest.start_url}
                        onChange={(e) => setPwaManifest({...pwaManifest, start_url: e.target.value})}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Icon URL <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4 items-start">
                        {pwaManifest.icon_url && (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-center">
                            <img src={pwaManifest.icon_url} alt="Icon Preview" className="h-8 w-8 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <input
                          type="url"
                          required
                          value={pwaManifest.icon_url}
                          onChange={(e) => setPwaManifest({...pwaManifest, icon_url: e.target.value})}
                          placeholder="https://example.com/icon.png"
                          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                        />
                      </div>
                      <p className="text-xs text-zinc-500">Must be a direct link to an image (PNG, JPG, SVG).</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Theme Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={pwaManifest.theme_color}
                          onChange={(e) => setPwaManifest({...pwaManifest, theme_color: e.target.value})}
                          className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={pwaManifest.theme_color}
                          onChange={(e) => setPwaManifest({...pwaManifest, theme_color: e.target.value})}
                          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Background Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={pwaManifest.background_color}
                          onChange={(e) => setPwaManifest({...pwaManifest, background_color: e.target.value})}
                          className="h-10 w-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={pwaManifest.background_color}
                          onChange={(e) => setPwaManifest({...pwaManifest, background_color: e.target.value})}
                          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setScanStatus('idle')}
                      className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-[#111827] dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isBuildingPwa}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                    >
                      {isBuildingPwa ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Building PWA...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          Build PWA Package
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Info */}
            <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                Convert Website to Android App (.apk and .aab file)
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    App Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                    placeholder="e.g. My Awesome App"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Website Link <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Include http or https</p>
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Android Package Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Keep it in lowercase, in this format com.yourcompanyname.yourappname only; otherwise, your order may fail, or you may face errors when submitting your app to the Play Store.
                  </p>
                  <input
                    type="text"
                    required
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value.toLowerCase())}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                    placeholder="com.company.appname"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Version Code <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Numeric number of your app (e.g. 1, 2, 3). Not visible to customer.
                </p>
                <input
                  type="number"
                  min="1"
                  required
                  value={versionCode}
                  onChange={(e) => setVersionCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Version Name <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  String used as the version number shown to users (e.g. 1.0, 1.1.1).
                </p>
                <input
                  type="text"
                  required
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                />
              </div>
            </div>
          </div>

          {/* Assets & Styling */}
          <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              Assets & Styling
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  App Icon or Logo <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Recommended Size 512px X 512px. Max file size 500kb.
                </p>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-8 dark:border-zinc-700">
                  {appIconPreview ? (
                    <div className="relative inline-block">
                      <img src={appIconPreview} alt="App Icon Preview" className="w-32 h-32 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                      <button 
                        type="button" 
                        onClick={() => { setAppIcon(null); setAppIconPreview(null); }} 
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-zinc-400" />
                      <div className="mt-4 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:bg-[#111827] dark:text-blue-400">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/png, image/jpeg" 
                            onChange={(e) => handleImageUpload(e, setAppIcon, setAppIconPreview)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-zinc-500">PNG, JPG up to 500KB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Main Colour <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Applied to the top bar and the progress bar.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      required
                      value={mainColor}
                      onChange={(e) => setMainColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-[#374151] dark:bg-[#111827]"
                    />
                    <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{mainColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Keystore & Signing <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Required for uploading your app to Google Playstore.
                  </p>
                  <select
                    required
                    value={keystore}
                    onChange={(e) => setKeystore(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                  >
                    <option value="generate">Generate New (For new app)</option>
                    <option value="existing">Use Existing (To update existing app)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Splash Screen */}
          <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Splash Screen <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  The first screen users see when the app starts, shown before the main content loads.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={splashScreen}
                  onChange={(e) => setSplashScreen(e.target.checked)}
                />
                <div className="peer h-6 w-11 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-zinc-700 dark:peer-focus:ring-blue-800"></div>
              </label>
            </div>
            
            {splashScreen && (
              <div className="grid gap-6 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Splash Image
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Recommended Size (W)720px X (H)1280px. Max file size 500kb.
                  </p>
                  <div className="mt-1 flex justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-8 dark:border-zinc-700">
                    {splashImagePreview ? (
                      <div className="relative inline-block">
                        <img src={splashImagePreview} alt="Splash Preview" className="w-24 h-40 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                        <button 
                          type="button" 
                          onClick={() => { setSplashImageFile(null); setSplashImagePreview(null); }} 
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-zinc-400" />
                        <div className="mt-4 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                          <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:bg-[#111827] dark:text-blue-400">
                            <span>Upload a file</span>
                            <input 
                              type="file" 
                              className="sr-only" 
                              accept="image/png, image/jpeg" 
                              onChange={(e) => handleImageUpload(e, setSplashImageFile, setSplashImagePreview)}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-zinc-500">PNG, JPG up to 500KB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Splash Image Background Colour
                  </label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Appears in areas not covered by the image.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={splashBgColor}
                      onChange={(e) => setSplashBgColor(e.target.value)}
                      className="h-10 w-20 cursor-pointer rounded-xl border border-zinc-200 bg-white p-1 dark:border-[#374151] dark:bg-[#111827]"
                    />
                    <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{splashBgColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features & Permissions */}
          <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              Features & Permissions
            </h3>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">App Features</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="pullToRefresh"
                      checked={pullToRefresh}
                      onChange={(e) => setPullToRefresh(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-600 dark:bg-zinc-700"
                    />
                    <label htmlFor="pullToRefresh" className="cursor-pointer">
                      <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pull to Refresh <span className="text-red-500">*</span></span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">Enabling the pull-to-refresh feature, allowing users to refresh the page by swiping down. Test before submitting a premium app order.</span>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirmOnExit"
                      checked={confirmOnExit}
                      onChange={(e) => setConfirmOnExit(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-600 dark:bg-zinc-700"
                    />
                    <label htmlFor="confirmOnExit" className="cursor-pointer">
                      <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm On Exit <span className="text-red-500">*</span></span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">Shows a confirmation dialog when the user tries to exit the app.</span>
                    </label>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Progress Bar <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Displays a progress bar during page loading for better user experience.</p>
                    <select
                      required
                      value={progressBar}
                      onChange={(e) => setProgressBar(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                    >
                      <option value="none">None</option>
                      <option value="circular">Circular Progress Bar</option>
                      <option value="horizontal">Horizontal Line Progress Bar</option>
                    </select>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        AdMob Monetization <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Banner ad will appear at the bottom. Interstitial ads will appear as full-screen ads at regular intervals.</p>
                      <select
                        required
                        value={admob}
                        onChange={(e) => setAdmob(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                      >
                        <option value="not_required">Not Required</option>
                        <option value="banner">Banner Ad</option>
                        <option value="interstitial">Interstitial Ad</option>
                        <option value="both">Banner Ad and Interstitial Ad</option>
                      </select>
                    </div>

                    {admob !== 'not_required' && (
                      <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            AdMob App Id <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={admobAppId}
                            onChange={(e) => setAdmobAppId(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                            placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx"
                          />
                        </div>

                        {(admob === 'banner' || admob === 'both') && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              Banner Ad Unit ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={bannerAdUnitId}
                              onChange={(e) => setBannerAdUnitId(e.target.value)}
                              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                              placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                            />
                          </div>
                        )}

                        {(admob === 'interstitial' || admob === 'both') && (
                          <>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Interstitial Ad Unit ID <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={interstitialAdUnitId}
                                onChange={(e) => setInterstitialAdUnitId(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Interstitial Ad Interval (In seconds) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={interstitialAdInterval}
                                onChange={(e) => setInterstitialAdInterval(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                                placeholder="e.g. 60"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Permissions</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Select the permissions your website requires to function properly in the app.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handlePermissionChange(key as keyof typeof permissions)}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-600 dark:bg-zinc-700"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300 capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm dark:border-[#374151]/60 dark:bg-[#1f2937]/80 space-y-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              Push Notifications
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Notification Provider <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.value)}
                  className="w-full md:w-1/2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                >
                  <option value="none">None</option>
                  <option value="firebase">Firebase</option>
                  <option value="onesignal">Firebase and One Signal</option>
                </select>
              </div>

              {pushNotifications !== 'none' && (
                <div className="grid gap-6 md:grid-cols-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Google Services Json File <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-4 dark:border-zinc-700 bg-white dark:bg-[#111827]">
                      {googleServicesFile ? (
                        <div className="flex items-center justify-between w-full bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                              {googleServicesFile.name}
                            </span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setGoogleServicesFile(null)} 
                            className="text-red-500 hover:text-red-600 p-1 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex text-sm leading-6 text-zinc-600 dark:text-zinc-400 justify-center">
                            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 dark:bg-[#111827] dark:text-blue-400">
                              <span>Upload File</span>
                              <input 
                                type="file" 
                                className="sr-only" 
                                accept=".json" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setGoogleServicesFile(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-xs leading-5 text-zinc-500">google-services.json</p>
                        </div>
                      )}
                    </div>
                    <a 
                      href="https://www.freewebsitetoapp.com/wp-content/uploads/2022/09/How-To-Generate-Google-Services-Json-File.mp4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center mt-1"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      How To Generate Google Services Json File ?
                    </a>
                  </div>

                  {pushNotifications === 'onesignal' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        One Signal App ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={oneSignalAppId}
                        onChange={(e) => setOneSignalAppId(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-[#374151] dark:bg-[#111827] dark:text-zinc-50"
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      />
                      <a 
                        href="https://documentation.onesignal.com/docs/android-firebase-credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center mt-1"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        How To Generate One Signal App ID? (Text tutorial)
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 pt-4">
            <div className="flex flex-col sm:items-end w-full sm:w-auto">
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-zinc-200 dark:bg-zinc-800 px-8 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-500 cursor-not-allowed"
                title="Currently in maintenance"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Convert to App (Maintenance)
              </button>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 max-w-xs sm:text-right">
                Direct APK compilation is currently under maintenance. Use the PWA option instead.
              </p>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
