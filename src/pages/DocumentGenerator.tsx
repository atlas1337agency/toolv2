import React, { useState, useEffect, useRef } from "react";
import { Document, Page, Text, View, StyleSheet, usePDF, Image } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/services/storage";
import { motion } from "motion/react";
import { ProjectManager } from "@/components/ProjectManager";
import { Loader2, Eye, Edit3, Download, Printer, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatCurrency } from "@/lib/utils";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11, color: "#333", lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  logoContainer: { width: "50%" },
  titleContainer: { width: "50%", alignItems: "flex-end" },
  title: { fontSize: 24, fontWeight: "bold", color: "#111", textTransform: "uppercase", marginBottom: 15 },
  receiptNo: { fontSize: 12, color: "#555" },
  address: { fontSize: 10, color: "#666", marginTop: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 5 },
  infoCol: { width: "48%" },
  bold: { fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  section: { marginTop: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", fontFamily: "Helvetica-Bold", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 5 },
  descBox: { minHeight: 60, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 4, marginBottom: 10 },
  financials: { width: "50%", alignSelf: "flex-end", marginTop: 10 },
  finRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  finTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: "#000", marginTop: 4, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  footer: { marginTop: 30, flexDirection: "row", justifyContent: "space-between" },
  noteBox: { width: "60%", fontSize: 9, color: "#666" },
  signatureBox: { width: "30%", alignItems: "center" },
  signatureLine: { width: "100%", borderBottomWidth: 1, borderBottomColor: "#000", marginTop: 40, marginBottom: 5 },
});

const t = {
  en: {
    receipt: "Payment Receipt", logo: "Logo", removeBg: "Remove White Background",
    address: "Address", title: "Title", receiptNumber: "Receipt No.",
    paidBy: "Paid By", paidTo: "Paid To", description: "Description",
    location: "Location", date: "Date", advance: "Advance", total: "Total",
    remaining: "Remaining Balance", signature: "Signature", note: "Note (Optional)",
    edit: "Edit", preview: "Preview", print: "Print", downloadPdf: "Download PDF",
    language: "Language", currency: "Currency"
  },
  fr: {
    receipt: "Reçu de paiement", logo: "Logo", removeBg: "Supprimer le fond blanc",
    address: "Adresse", title: "Titre", receiptNumber: "N° de Reçu",
    paidBy: "Payé par", paidTo: "Payé à", description: "Description",
    location: "Lieu", date: "Date", advance: "Avance", total: "Total",
    remaining: "Reste à payer", signature: "Signature", note: "Note (Optionnelle)",
    edit: "Modifier", preview: "Aperçu", print: "Imprimer", downloadPdf: "Télécharger PDF",
    language: "Langue", currency: "Devise"
  }
};

interface ReceiptData {
  lang: "en" | "fr";
  logo: string | null;
  originalLogo: string | null;
  removeLogoBg: boolean;
  address: string;
  title: string;
  receiptNumber: string;
  paidBy: string;
  paidTo: string;
  description: string;
  location: string;
  date: string;
  advance: number;
  total: number;
  signature: string;
  note: string;
  currency: string;
}

const defaultData: ReceiptData = {
  lang: "fr",
  logo: null,
  originalLogo: null,
  removeLogoBg: false,
  address: "123 Rue de la Paix, 75000 Paris",
  title: "Reçu de paiement",
  receiptNumber: "REC-2026-001",
  paidBy: "Client ABC",
  paidTo: "Mon Entreprise",
  description: "Paiement pour services de développement web.",
  location: "Paris",
  date: new Date().toISOString().split("T")[0],
  advance: 500,
  total: 1500,
  signature: "Directeur Financier",
  note: "Merci pour votre confiance.",
  currency: "EUR"
};

const ReceiptPDF = ({ data }: { data: ReceiptData }) => {
  const lang = t[data.lang];
  const remaining = Math.max(0, data.total - data.advance);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {data.logo && <Image src={data.logo} style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 10 }} />}
            <Text style={styles.address}>{data.address}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{data.title || lang.receipt}</Text>
            <Text style={styles.receiptNo}>{lang.receiptNumber}: {data.receiptNumber}</Text>
            <Text style={{ marginTop: 5 }}>{lang.date}: {data.date}</Text>
            <Text>{lang.location}: {data.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.bold}>{lang.paidBy}:</Text>
              <Text>{data.paidBy}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.bold}>{lang.paidTo}:</Text>
              <Text>{data.paidTo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{lang.description}</Text>
          <View style={styles.descBox}>
            <Text>{data.description}</Text>
          </View>
        </View>

        <View style={styles.financials}>
          <View style={styles.finRow}>
            <Text>{lang.total}:</Text>
            <Text>{formatCurrency(data.total)} {data.currency}</Text>
          </View>
          <View style={styles.finRow}>
            <Text>{lang.advance}:</Text>
            <Text>{formatCurrency(data.advance)} {data.currency}</Text>
          </View>
          <View style={styles.finTotal}>
            <Text>{lang.remaining}:</Text>
            <Text>{formatCurrency(remaining)} {data.currency}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.noteBox}>
            {data.note && (
              <>
                <Text style={styles.bold}>{lang.note}:</Text>
                <Text style={{ marginTop: 5 }}>{data.note}</Text>
              </>
            )}
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}></View>
            <Text>{data.signature || lang.signature}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const A4PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950 overflow-y-auto overflow-x-hidden flex-1">
      <div className="w-full min-h-full">
        {children}
      </div>
    </div>
  );
};

// --- Live DOM Preview Component ---
const LiveReceiptPreview = ({ data }: { data: ReceiptData }) => {
  const lang = t[data.lang];
  const remaining = Math.max(0, data.total - data.advance);

  return (
    <div className="w-full min-h-full text-[#333] text-[15px] leading-[1.6] font-sans bg-white">
      <div className="w-full min-h-full p-4 sm:p-6 md:p-12 flex flex-col">
        <div className="flex justify-between mb-8">
          <div className="w-1/2">
            {data.logo && <img src={data.logo} alt="Logo" className="w-24 h-24 object-contain mb-4" />}
            <div className="text-[14px] text-[#666] whitespace-pre-wrap">{data.address}</div>
          </div>
          <div className="w-1/2 flex flex-col items-end text-right">
            <h1 className="text-3xl font-bold text-[#111] uppercase mb-4">{data.title || lang.receipt}</h1>
            <div className="text-[16px] text-[#555] mb-2">{lang.receiptNumber}: {data.receiptNumber}</div>
            <div className="mt-2">{lang.date}: {data.date}</div>
            <div>{lang.location}: {data.location}</div>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <div className="flex justify-between mb-4 border-b border-[#eee] pb-2">
            <div className="w-[48%]">
              <span className="font-bold">{lang.paidBy}:</span> {data.paidBy}
            </div>
            <div className="w-[48%]">
              <span className="font-bold">{lang.paidTo}:</span> {data.paidTo}
            </div>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <div className="text-[18px] font-bold border-b border-[#000] pb-2 mb-4">{lang.description}</div>
          <div className="min-h-[80px] p-4 bg-[#f9f9f9] rounded-md whitespace-pre-wrap">
            {data.description}
          </div>
        </div>

        <div className="w-1/2 self-end mt-4">
          <div className="flex justify-between py-2">
            <div>{lang.total}:</div>
            <div>{formatCurrency(data.total)} {data.currency}</div>
          </div>
          <div className="flex justify-between py-2">
            <div>{lang.advance}:</div>
            <div>{formatCurrency(data.advance)} {data.currency}</div>
          </div>
          <div className="flex justify-between py-2 border-t border-[#000] mt-2 font-bold text-[16px]">
            <div>{lang.remaining}:</div>
            <div>{formatCurrency(remaining)} {data.currency}</div>
          </div>
        </div>

        <div className="mt-12 flex justify-between flex-1 items-end">
          <div className="w-[60%] text-[12px] text-[#666]">
            {data.note && (
              <>
                <div className="font-bold text-[#333] mb-1">{lang.note}:</div>
                <div className="whitespace-pre-wrap">{data.note}</div>
              </>
            )}
          </div>
          <div className="w-[30%] flex flex-col items-center">
            <div className="w-full border-b border-[#000] mb-2"></div>
            <div>{data.signature || lang.signature}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function DocumentGenerator() {
  const [data, setData] = useState<ReceiptData>(() => storage.get("receipt_data_v1", defaultData));
  const debouncedData = useDebounce(data, 500);
  const [instance, updateInstance] = usePDF({ document: <ReceiptPDF data={debouncedData} /> });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    storage.set("receipt_data_v1", data);
  }, [data]);

  useEffect(() => {
    updateInstance(<ReceiptPDF data={debouncedData} />);
  }, [debouncedData, updateInstance]);

  const updateField = (field: keyof ReceiptData, value: any) => setData(prev => ({ ...prev, [field]: value }));

  const removeWhiteBg = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
          if (r > 240 && g > 240 && b > 240) {
            pixels[i+3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const src = ev.target?.result as string;
      setData(prev => ({ ...prev, originalLogo: src, logo: src, removeLogoBg: false }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setData(prev => ({ ...prev, logo: null, originalLogo: null, removeLogoBg: false }));
  };

  const toggleRemoveBg = async (checked: boolean) => {
    setData(prev => ({ ...prev, removeLogoBg: checked }));
    if (checked && data.originalLogo) {
      const newLogo = await removeWhiteBg(data.originalLogo);
      setData(prev => ({ ...prev, logo: newLogo }));
    } else if (!checked && data.originalLogo) {
      setData(prev => ({ ...prev, logo: data.originalLogo }));
    }
  };

  const lang = t[data.lang];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
      {/* Mobile Tabs */}
      <div className="flex p-4 lg:hidden border-b border-zinc-200/60 dark:border-zinc-800/60 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex w-full rounded-xl bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
          <button
            onClick={() => setActiveTab("edit")}
            className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "edit" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}
          >
            <Edit3 className="h-4 w-4" /> {lang.edit}
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "preview" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}
          >
            <Eye className="h-4 w-4" /> {lang.preview}
          </button>
        </div>
      </div>

      {/* Edit Area */}
      <div className={cn("w-full overflow-y-auto border-r border-zinc-200/60 p-4 sm:p-6 lg:w-[55%] dark:border-zinc-800/60", activeTab === "preview" ? "hidden lg:block" : "block")}>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lang.receipt}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create professional payment receipts.</p>
          </div>
          <div className="flex items-center gap-2">
            <ProjectManager
              storageKey="receipt_projects_v1"
              currentData={data}
              onLoad={(newData) => setData(newData)}
              titleExtractor={(d) => d.receiptNumber}
              typeLabel="Receipt"
            />
            <select 
              className="h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              value={data.lang}
              onChange={(e) => updateField("lang", e.target.value as "en" | "fr")}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="space-y-6 pb-20">
          <Card>
            <CardHeader><CardTitle>{lang.logo || "Logo"}</CardTitle></CardHeader>
            <CardContent>
              {!data.logo ? (
                <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mb-4" />
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg inline-block w-max relative group">
                      <img src={data.logo} alt="Logo" className="h-20 object-contain" />
                      <button 
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <div>
                        <Button variant="outline" size="sm" onClick={() => document.getElementById('receipt-logo-upload')?.click()}>
                          Replace Logo
                        </Button>
                        <Input id="receipt-logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="removeBgReceipt"
                          checked={data.removeLogoBg} 
                          onChange={e => toggleRemoveBg(e.target.checked)} 
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:checked:bg-zinc-50"
                        />
                        <Label htmlFor="removeBgReceipt" className="text-sm cursor-pointer">{lang.removeBg}</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{lang.title}</Label><Input value={data.title} onChange={e => updateField("title", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.receiptNumber}</Label><Input value={data.receiptNumber} onChange={e => updateField("receiptNumber", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.date}</Label><Input type="date" value={data.date} onChange={e => updateField("date", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.location}</Label><Input value={data.location} onChange={e => updateField("location", e.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>{lang.address}</Label><Input value={data.address} onChange={e => updateField("address", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{lang.paidBy}</Label><Input value={data.paidBy} onChange={e => updateField("paidBy", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.paidTo}</Label><Input value={data.paidTo} onChange={e => updateField("paidTo", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{lang.description}</CardTitle></CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[100px]" 
                value={data.description} 
                onChange={e => updateField("description", e.target.value)} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Financials</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>{lang.currency}</Label><Input value={data.currency} onChange={e => updateField("currency", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.total}</Label><Input type="number" value={data.total} onChange={e => updateField("total", Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>{lang.advance}</Label><Input type="number" value={data.advance} onChange={e => updateField("advance", Number(e.target.value))} /></div>
              <div className="space-y-2 sm:col-span-3">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex justify-between items-center">
                  <span className="font-medium">{lang.remaining}:</span>
                  <span className="font-bold text-lg">{formatCurrency(Math.max(0, data.total - data.advance))} {data.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2"><Label>{lang.signature}</Label><Input value={data.signature} onChange={e => updateField("signature", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.note}</Label><Textarea value={data.note} onChange={e => updateField("note", e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Area */}
      <div className={cn("h-full w-full bg-zinc-100 lg:w-[45%] xl:w-1/2 dark:bg-zinc-900 border-l border-zinc-200/60 dark:border-zinc-800/60 flex flex-col overflow-hidden", activeTab === "edit" ? "hidden lg:flex" : "flex")}>
        {/* Preview Action Header / Toolbar */}
        <div className="shrink-0 px-3 sm:px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200/70 dark:border-zinc-800/70 flex flex-wrap items-center justify-between gap-2 z-10 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang.preview}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              if (instance.url) window.open(instance.url, '_blank');
            }} className="h-8 px-2.5 sm:px-3 text-xs bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5"/> {lang.print}
            </Button>
            <Button size="sm" className="h-8 px-2.5 sm:px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs" onClick={() => {
              if (instance.url) {
                const link = document.createElement('a');
                link.href = instance.url;
                link.download = `${data.receiptNumber}.pdf`;
                link.click();
              }
            }}>
              {instance.url ? (
                <><Download className="w-3.5 h-3.5 mr-1.5"/> {lang.downloadPdf}</>
              ) : (
                <><Loader2 className="h-3.5 h-3.5 mr-1.5 animate-spin" /> {data.lang === "fr" ? "Génération..." : "Generating..."}</>
              )}
            </Button>
          </div>
        </div>

        <A4PreviewWrapper>
          <LiveReceiptPreview data={data} />
        </A4PreviewWrapper>
      </div>
    </motion.div>
  );
}
