import React, { useState, useRef, useEffect, useCallback } from "react";
import QRCodeStyling, { DotType, CornerSquareType } from "qr-code-styling";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, Edit3, MapPin, Wifi, Calendar, Mail, Link as LinkIcon, Image as ImageIcon, Palette, LayoutTemplate, ChevronUp, ChevronDown, ArrowLeft, Search } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }: { position: L.LatLngExpression, setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} draggable={true} eventHandlers={{
      dragend: (e) => {
        setPosition(e.target.getLatLng());
      }
    }}></Marker>
  )
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium">
          <Icon className="w-4 h-4 text-zinc-500" />
          {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
}

type QRType = "url" | "email" | "location" | "wifi" | "event";

export function QRCodeGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const qrRef = useRef<HTMLDivElement>(null);

  const [qrType, setQrType] = useState<QRType>("url");

  // Data states
  const [urlData, setUrlData] = useState({ url: "https://example.com" });
  const [emailData, setEmailData] = useState({ email: "", subject: "", message: "" });
  const [locationData, setLocationData] = useState({ address: "", lat: "51.505", lng: "-0.09" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "", encryption: "WPA" });
  const [eventData, setEventData] = useState({ title: "", location: "", start: "", end: "" });

  // Design states
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [removeLogoBg, setRemoveLogoBg] = useState(false);
  const [bodyShape, setBodyShape] = useState<DotType>("square");
  const [eyeShape, setEyeShape] = useState<CornerSquareType>("square");

  // Preview states
  const [quality, setQuality] = useState<"low" | "1000x1000" | "high">("1000x1000");
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchAddress = async () => {
    if (!locationData.address) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationData.address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLocationData({
          ...locationData,
          lat: data[0].lat,
          lng: data[0].lon
        });
      } else {
        alert("Address not found. Try a different search term.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const [qrCode] = useState<QRCodeStyling>(() => {
    if (typeof window !== "undefined") {
      return new QRCodeStyling({
        width: 300,
        height: 300,
        imageOptions: { crossOrigin: "anonymous", margin: 10 }
      });
    }
    return null as any;
  });

  useEffect(() => {
    if (qrRef.current && qrCode) {
      qrRef.current.innerHTML = "";
      qrCode.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  const generateQRData = useCallback(() => {
    switch (qrType) {
      case "url": 
        return urlData.url || "https://example.com";
      case "email": 
        return `mailto:${emailData.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
      case "location": 
        return `https://www.google.com/maps/search/?api=1&query=${locationData.lat},${locationData.lng}`;
      case "wifi": 
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:;;`;
      case "event": {
        const formatVEventDate = (dateStr: string) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };
        return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventData.title}\nLOCATION:${eventData.location}\nDTSTART:${formatVEventDate(eventData.start)}\nDTEND:${formatVEventDate(eventData.end)}\nEND:VEVENT\nEND:VCALENDAR`;
      }
      default:
        return "https://example.com";
    }
  }, [qrType, urlData, emailData, locationData, wifiData, eventData]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update({
      data: generateQRData(),
      dotsOptions: { color: fgColor, type: bodyShape },
      cornersSquareOptions: { color: fgColor, type: eyeShape },
      cornersDotOptions: { color: fgColor, type: eyeShape === "square" ? "square" : "dot" },
      backgroundOptions: { color: removeBackground ? "transparent" : bgColor },
      image: logo || undefined,
      imageOptions: { hideBackgroundDots: removeLogoBg, imageSize: 0.4, margin: 10 }
    });
  }, [qrCode, generateQRData, fgColor, bgColor, bodyShape, eyeShape, logo, removeLogoBg, removeBackground]);

  const handleDownload = async (format: "png" | "svg" | "pdf" | "eps") => {
    if (!qrCode) return;
    let size = 300;
    if (quality === "low") size = 300;
    if (quality === "1000x1000") size = 1000;
    if (quality === "high") size = 2000;

    qrCode.update({ width: size, height: size });

    try {
      if (format === "png" || format === "svg") {
        await qrCode.download({ name: "qrcode", extension: format });
      } else if (format === "pdf") {
        const rawData = await qrCode.getRawData("png");
        if (rawData) {
          const blob = rawData instanceof Blob ? rawData : new Blob([rawData], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [size, size] });
          pdf.addImage(url, "PNG", 0, 0, size, size);
          pdf.save("qrcode.pdf");
          URL.revokeObjectURL(url);
        }
      } else if (format === "eps") {
        alert("EPS download is simulated as SVG in this browser environment.");
        await qrCode.download({ name: "qrcode", extension: "svg" });
      }
    } catch (error) {
      console.error("Download failed", error);
    }

    // Restore size for preview
    qrCode.update({ width: 300, height: 300 });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col lg:flex-row h-full">
      {/* Mobile Tabs */}
      <div className="flex p-4 lg:hidden border-b border-zinc-200/60 dark:border-zinc-800/60 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="flex w-full rounded-xl bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
          <button
            onClick={() => setActiveTab("edit")}
            className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "edit" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "preview" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>
      </div>

      {/* Form Area */}
      <div className={cn("w-full overflow-y-auto border-r border-zinc-200/60 p-6 lg:p-8 lg:w-1/2 dark:border-zinc-800/60", activeTab === "preview" ? "hidden lg:block" : "block")}>
        <div className="mb-8 flex items-center gap-4 pt-4 lg:pt-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/qr")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create and download custom, smart QR codes.</p>
          </div>
        </div>
        
        <div className="space-y-6 pb-20">
          <Tabs value={qrType} onValueChange={(v) => setQrType(v as QRType)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-6">
              <TabsTrigger value="url" className="flex flex-col gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 rounded-lg"><LinkIcon className="w-4 h-4"/> <span className="text-[10px] font-medium uppercase">URL</span></TabsTrigger>
              <TabsTrigger value="email" className="flex flex-col gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 rounded-lg"><Mail className="w-4 h-4"/> <span className="text-[10px] font-medium uppercase">Email</span></TabsTrigger>
              <TabsTrigger value="location" className="flex flex-col gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 rounded-lg"><MapPin className="w-4 h-4"/> <span className="text-[10px] font-medium uppercase">Location</span></TabsTrigger>
              <TabsTrigger value="wifi" className="flex flex-col gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 rounded-lg"><Wifi className="w-4 h-4"/> <span className="text-[10px] font-medium uppercase">WiFi</span></TabsTrigger>
              <TabsTrigger value="event" className="flex flex-col gap-1 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 rounded-lg"><Calendar className="w-4 h-4"/> <span className="text-[10px] font-medium uppercase">Event</span></TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label>Your URL</Label>
                <Input value={urlData.url} onChange={(e) => setUrlData({ url: e.target.value })} placeholder="https://example.com" />
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2"><Label>Your Email</Label><Input type="email" value={emailData.email} onChange={(e) => setEmailData({...emailData, email: e.target.value})} placeholder="hello@example.com" /></div>
              <div className="space-y-2"><Label>Subject</Label><Input value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} placeholder="Hello" /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea value={emailData.message} onChange={(e) => setEmailData({...emailData, message: e.target.value})} placeholder="Write your message here..." /></div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <div className="space-y-2">
                <Label>Search Your Address</Label>
                <div className="flex gap-2">
                  <Input 
                    value={locationData.address} 
                    onChange={(e) => setLocationData({...locationData, address: e.target.value})} 
                    placeholder="123 Main St..." 
                    onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                  />
                  <Button onClick={searchAddress} disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Latitude</Label><Input type="number" value={locationData.lat} onChange={(e) => setLocationData({...locationData, lat: e.target.value})} /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input type="number" value={locationData.lng} onChange={(e) => setLocationData({...locationData, lng: e.target.value})} /></div>
              </div>
              <div className="space-y-2">
                <Label>You can manually drag the marker on the map.</Label>
                <div className="h-64 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 z-0 relative">
                  <MapContainer center={[parseFloat(locationData.lat) || 0, parseFloat(locationData.lng) || 0]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapUpdater center={[parseFloat(locationData.lat) || 0, parseFloat(locationData.lng) || 0]} />
                    <LocationMarker position={[parseFloat(locationData.lat) || 0, parseFloat(locationData.lng) || 0]} setPosition={(pos) => setLocationData({...locationData, lat: pos.lat.toString(), lng: pos.lng.toString()})} />
                  </MapContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="space-y-4">
              <div className="space-y-2"><Label>Wireless SSID</Label><Input value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} placeholder="Network Name" /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} placeholder="Network Password" /></div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                  value={wifiData.encryption}
                  onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})}
                >
                  <option value="nopass">No Encryption</option>
                  <option value="WEP">WEP</option>
                  <option value="WPA">WPA/WPA2</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="event" className="space-y-4">
              <div className="space-y-2"><Label>Event Title</Label><Input value={eventData.title} onChange={(e) => setEventData({...eventData, title: e.target.value})} placeholder="My Awesome Event" /></div>
              <div className="space-y-2"><Label>Event Location</Label><Input value={eventData.location} onChange={(e) => setEventData({...eventData, location: e.target.value})} placeholder="123 Event St" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Time</Label><Input type="datetime-local" value={eventData.start} onChange={(e) => setEventData({...eventData, start: e.target.value})} /></div>
                <div className="space-y-2"><Label>End Time</Label><Input type="datetime-local" value={eventData.end} onChange={(e) => setEventData({...eventData, end: e.target.value})} /></div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Design Options</h3>
            
            <CollapsibleSection title="Set Colors" icon={Palette} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                    <Input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex-1 uppercase" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
                    <Input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 uppercase" />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Add Logo Image" icon={ImageIcon}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Logo</Label>
                  <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setLogo(e.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                {logo && (
                  <div className="flex items-center gap-4">
                    <img src={logo} alt="Logo" className="w-12 h-12 object-contain border rounded-md p-1" />
                    <Button variant="outline" size="sm" onClick={() => setLogo(null)} className="text-red-500">Remove Logo</Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="removeLogoBg" 
                    checked={removeLogoBg} 
                    onChange={(e) => setRemoveLogoBg(e.target.checked)}
                    className="rounded border-zinc-300"
                  />
                  <Label htmlFor="removeLogoBg">Remove Background Behind Logo</Label>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Customize Design" icon={LayoutTemplate}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Body Shape</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                    value={bodyShape}
                    onChange={(e) => setBodyShape(e.target.value as DotType)}
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Eye Shape</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                    value={eyeShape}
                    onChange={(e) => setEyeShape(e.target.value as CornerSquareType)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className={cn("h-full w-full flex-col bg-zinc-100/50 p-4 sm:p-6 lg:w-1/2 dark:bg-zinc-900/50 overflow-y-auto", activeTab === "edit" ? "hidden lg:flex" : "flex")}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto w-full space-y-6">
          <Card className="flex flex-col items-center p-4 sm:p-8 shadow-xl w-full overflow-hidden">
            <div className={cn("rounded-2xl bg-white p-2 sm:p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors w-full max-w-[348px] flex items-center justify-center", removeBackground && "bg-transparent shadow-none border-dashed border-zinc-300 dark:border-zinc-700")}>
              <div ref={qrRef} className="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>canvas]:max-w-full [&>canvas]:h-auto" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Download Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Quality / Size</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                >
                  <option value="low">Low Quality (300x300 Px)</option>
                  <option value="1000x1000">Medium Quality (1000x1000 Px)</option>
                  <option value="high">High Quality (2000x2000 Px)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="removeBg" 
                  checked={removeBackground} 
                  onChange={(e) => setRemoveBackground(e.target.checked)}
                  className="rounded border-zinc-300 h-4 w-4"
                />
                <Label htmlFor="removeBg">Remove Background (Transparent)</Label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button onClick={() => handleDownload("png")} className="w-full gap-2"><Download className="w-4 h-4"/> PNG</Button>
                <Button onClick={() => handleDownload("svg")} variant="outline" className="w-full gap-2"><Download className="w-4 h-4"/> SVG</Button>
                <Button onClick={() => handleDownload("pdf")} variant="outline" className="w-full gap-2"><Download className="w-4 h-4"/> PDF</Button>
                <Button onClick={() => handleDownload("eps")} variant="outline" className="w-full gap-2"><Download className="w-4 h-4"/> EPS</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

