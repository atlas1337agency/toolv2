import React, { useState, useEffect, useRef } from "react";
import { Document, Page, Text, View, StyleSheet, usePDF, Font, Image } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/services/storage";
import { motion } from "motion/react";
import { ProjectManager } from "@/components/ProjectManager";
import { Loader2, Plus, Trash2, Eye, Edit3, Download, Printer, FileText, Image as ImageIcon, Mail } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatCurrency } from "@/lib/utils";
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun } from "docx";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#333" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111", textTransform: "uppercase" },
  section: { marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  bold: { fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  table: { width: "100%", marginTop: 15 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 5, marginBottom: 5, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#eee" },
  colDesc: { width: "40%" },
  colQty: { width: "15%", textAlign: "right" },
  colPrice: { width: "15%", textAlign: "right" },
  colTax: { width: "10%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  totals: { marginTop: 15, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: "50%", paddingVertical: 3 },
  grandTotal: { fontWeight: "bold", fontFamily: "Helvetica-Bold", fontSize: 12, marginTop: 5, borderTopWidth: 1, borderTopColor: "#000", paddingTop: 5 },
  terms: { marginTop: 30, fontSize: 9, color: "#666", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 }
});

const t = {
  en: {
    facture: "Facture", quote: "Facture", customerName: "Customer Name", billingAddress: "Billing Address", shippingAddress: "Shipping Address",
    currency: "Currency", factureNum: "Facture #", referenceNum: "Reference #", date: "Date", dueDate: "Expiration Date",
    salesperson: "Salesperson", projectName: "Project Name", taxType: "Tax Type", taxExclusive: "Tax Exclusive", taxInclusive: "Tax Inclusive",
    itemDetails: "Item Details", qty: "Quantity", rate: "Rate", tax: "Tax (%)", amount: "Amount", addNewLine: "Add new line", addBulk: "Add items in bulk",
    subtotal: "Subtotal", discount: "Discount", shipping: "Shipping Charges", adjustment: "Adjustment", total: "Total",
    customerInfo: "Customer Information", terms: "Terms & Conditions",
    emailComms: "Email Communications", addNewContact: "Add new", noContactFound: "No contact person found.",
    downloadPdf: "Download PDF", downloadPng: "Download PNG", downloadWord: "Download Word", print: "Print", edit: "Edit", preview: "Preview",
    language: "Language", fromName: "Your Company", fromAddress: "Your Address",
    logo: "Logo", removeBg: "Remove White Background",
  },
  fr: {
    facture: "Facture", quote: "Facture", customerName: "Nom du client", billingAddress: "Adresse de facturation", shippingAddress: "Adresse de livraison",
    currency: "Devise", factureNum: "Facture #", referenceNum: "N° de référence", date: "Date de la Facture", dueDate: "Date d’expiration",
    salesperson: "Vendeur", projectName: "Nom du projet", taxType: "Type de taxe", taxExclusive: "Hors taxe", taxInclusive: "Taxe incluse",
    itemDetails: "Détails de l’article", qty: "Quantité", rate: "Taux", tax: "Taxe (%)", amount: "Montant", addNewLine: "Ajouter une nouvelle ligne", addBulk: "Ajouter les articles en bloc",
    subtotal: "Sous-total", discount: "Remise", shipping: "Frais d’expédition", adjustment: "Ajustement", total: "Total",
    customerInfo: "Informations sur le client", terms: "Conditions générales",
    emailComms: "Communications par e-mail", addNewContact: "Ajouter nouveau", noContactFound: "Aucune personne à contacter trouvée.",
    downloadPdf: "Télécharger PDF", downloadPng: "Télécharger PNG", downloadWord: "Télécharger Word", print: "Imprimer", edit: "Modifier", preview: "Aperçu",
    language: "Langue", fromName: "Votre Entreprise", fromAddress: "Votre Adresse",
    logo: "Logo", removeBg: "Supprimer le fond blanc",
  }
};

interface FactureItem { desc: string; qty: number; price: number; tax: number; }
interface Contact { name: string; email: string; }
interface FactureData {
  lang: "en" | "fr"; currency: string; factureNum: string; referenceNum: string; date: string; dueDate: string;
  salesperson: string; projectName: string; taxType: "exclusive" | "inclusive";
  fromName: string; fromAddress: string;
  toName: string; toBillingAddress: string; toShippingAddress: string;
  items: FactureItem[];
  discount: number; shipping: number; adjustment: number;
  customerInfo: string; terms: string;
  logo: string | null; originalLogo: string | null; removeLogoBg: boolean;
  contacts: Contact[];
}

const defaultData: FactureData = {
  lang: "fr", currency: "EUR", factureNum: "FAC-001", referenceNum: "REF-123", date: new Date().toISOString().split("T")[0], dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split("T")[0],
  salesperson: "Jean Dupont", projectName: "Refonte Site Web", taxType: "exclusive",
  fromName: "Mon Entreprise", fromAddress: "123 Rue de Paris, 75001 Paris",
  toName: "Client ABC", toBillingAddress: "456 Avenue de Lyon, 69001 Lyon", toShippingAddress: "456 Avenue de Lyon, 69001 Lyon",
  items: [{ desc: "Développement Web", qty: 1, price: 1000, tax: 20 }],
  discount: 0, shipping: 0, adjustment: 0,
  customerInfo: "Client VIP", terms: "Paiement à 30 jours. Pénalités de retard applicables.",
  logo: null, originalLogo: null, removeLogoBg: false,
  contacts: []
};

const FacturePDF = ({ data }: { data: FactureData }) => {
  const lang = t[data.lang];
  
  const calculateItemAmount = (item: FactureItem) => {
    const base = item.qty * item.price;
    if (data.taxType === "exclusive") {
      return base + (base * (item.tax / 100));
    }
    return base; // If inclusive, price already includes tax
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalTax = data.items.reduce((sum, item) => {
    const base = item.qty * item.price;
    if (data.taxType === "exclusive") return sum + (base * (item.tax / 100));
    return sum + (base - (base / (1 + item.tax / 100)));
  }, 0);
  
  const total = (data.taxType === "exclusive" ? subtotal + totalTax : subtotal) - data.discount + data.shipping + data.adjustment;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            {data.logo && <Image src={data.logo} style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 10 }} />}
            <Text style={styles.title}>{lang.quote}</Text>
            <Text style={styles.bold}>{lang.factureNum}: {data.factureNum}</Text>
            <Text>{lang.referenceNum}: {data.referenceNum}</Text>
            <Text>{lang.date}: {data.date}</Text>
            <Text>{lang.dueDate}: {data.dueDate}</Text>
            <Text>{lang.salesperson}: {data.salesperson}</Text>
            <Text>{lang.projectName}: {data.projectName}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.bold}>{data.fromName}</Text>
            <Text>{data.fromAddress}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ width: "48%" }}>
            <Text style={styles.bold}>{lang.billingAddress}:</Text>
            <Text>{data.toName}</Text>
            <Text>{data.toBillingAddress}</Text>
            {data.customerInfo && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.bold}>{lang.customerInfo}:</Text>
                <Text>{data.customerInfo}</Text>
              </View>
            )}
          </View>
          <View style={{ width: "48%" }}>
            <Text style={styles.bold}>{lang.shippingAddress}:</Text>
            <Text>{data.toName}</Text>
            <Text>{data.toShippingAddress}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>{lang.itemDetails}</Text>
            <Text style={styles.colQty}>{lang.qty}</Text>
            <Text style={styles.colPrice}>{lang.rate}</Text>
            <Text style={styles.colTax}>{lang.tax}</Text>
            <Text style={styles.colTotal}>{lang.amount}</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.desc}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.price)} {data.currency}</Text>
              <Text style={styles.colTax}>{item.tax}%</Text>
              <Text style={styles.colTotal}>{formatCurrency(calculateItemAmount(item))} {data.currency}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>{lang.subtotal}:</Text>
            <Text>{formatCurrency(subtotal)} {data.currency}</Text>
          </View>
          {data.taxType === "exclusive" && (
            <View style={styles.totalRow}>
              <Text>{lang.tax}:</Text>
              <Text>{formatCurrency(totalTax)} {data.currency}</Text>
            </View>
          )}
          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text>{lang.discount}:</Text>
              <Text>-{formatCurrency(data.discount)} {data.currency}</Text>
            </View>
          )}
          {data.shipping > 0 && (
            <View style={styles.totalRow}>
              <Text>{lang.shipping}:</Text>
              <Text>{formatCurrency(data.shipping)} {data.currency}</Text>
            </View>
          )}
          {data.adjustment !== 0 && (
            <View style={styles.totalRow}>
              <Text>{lang.adjustment}:</Text>
              <Text>{data.adjustment > 0 ? "+" : ""}{formatCurrency(data.adjustment)} {data.currency}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>{lang.total}:</Text>
            <Text>{formatCurrency(total)} {data.currency}</Text>
          </View>
          {data.taxType === "inclusive" && (
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 8, color: "#666" }}>Includes Tax: {formatCurrency(totalTax)} {data.currency}</Text>
            </View>
          )}
        </View>

        {data.terms && (
          <View style={styles.terms}>
            <Text style={styles.bold}>{lang.terms}:</Text>
            <Text>{data.terms}</Text>
          </View>
        )}
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
const LiveFacturePreview = ({ data }: { data: FactureData }) => {
  const lang = t[data.lang];
  
  const calculateItemAmount = (item: FactureItem) => {
    const base = item.qty * item.price;
    if (data.taxType === "exclusive") {
      return base + (base * (item.tax / 100));
    }
    return base;
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalTax = data.items.reduce((sum, item) => {
    const base = item.qty * item.price;
    if (data.taxType === "exclusive") return sum + (base * (item.tax / 100));
    return sum + (base - (base / (1 + item.tax / 100)));
  }, 0);
  
  const total = (data.taxType === "exclusive" ? subtotal + totalTax : subtotal) - data.discount + data.shipping + data.adjustment;

  return (
    <div className="w-full min-h-full text-[#333] text-[12px] leading-[1.6] font-sans bg-white">
      <div className="w-full min-h-full p-4 sm:p-6 md:p-12 flex flex-col">
        <div className="flex justify-between mb-8">
          <div>
            {data.logo && <img src={data.logo} alt="Logo" className="w-20 h-20 object-contain mb-2" />}
            <h1 className="text-2xl font-bold text-[#111] uppercase">{lang.quote}</h1>
            <div className="font-bold">{lang.factureNum}: {data.factureNum}</div>
            <div>{lang.referenceNum}: {data.referenceNum}</div>
            <div>{lang.date}: {data.date}</div>
            <div>{lang.dueDate}: {data.dueDate}</div>
            <div>{lang.salesperson}: {data.salesperson}</div>
            <div>{lang.projectName}: {data.projectName}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{data.fromName}</div>
            <div className="whitespace-pre-wrap">{data.fromAddress}</div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <div className="font-bold">{lang.billingAddress}:</div>
            <div>{data.toName}</div>
            <div className="whitespace-pre-wrap">{data.toBillingAddress}</div>
            {data.customerInfo && (
              <div className="mt-2">
                <div className="font-bold">{lang.customerInfo}:</div>
                <div className="whitespace-pre-wrap">{data.customerInfo}</div>
              </div>
            )}
          </div>
          <div className="w-[48%]">
            <div className="font-bold">{lang.shippingAddress}:</div>
            <div>{data.toName}</div>
            <div className="whitespace-pre-wrap">{data.toShippingAddress}</div>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="flex border-b border-[#000] pb-1 mb-1 font-bold">
            <div className="w-[40%]">{lang.itemDetails}</div>
            <div className="w-[15%] text-right">{lang.qty}</div>
            <div className="w-[15%] text-right">{lang.rate}</div>
            <div className="w-[10%] text-right">{lang.tax}</div>
            <div className="w-[20%] text-right">{lang.amount}</div>
          </div>
          {data.items.map((item, i) => (
            <div key={i} className="flex py-1 border-b border-[#eee]">
              <div className="w-[40%]">{item.desc}</div>
              <div className="w-[15%] text-right">{item.qty}</div>
              <div className="w-[15%] text-right">{formatCurrency(item.price)} {data.currency}</div>
              <div className="w-[10%] text-right">{item.tax}%</div>
              <div className="w-[20%] text-right">{formatCurrency(calculateItemAmount(item))} {data.currency}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-end flex-1">
          <div className="flex justify-between w-[50%] py-1">
            <div>{lang.subtotal}:</div>
            <div>{formatCurrency(subtotal)} {data.currency}</div>
          </div>
          {data.taxType === "exclusive" && (
            <div className="flex justify-between w-[50%] py-1">
              <div>{lang.tax}:</div>
              <div>{formatCurrency(totalTax)} {data.currency}</div>
            </div>
          )}
          {data.discount > 0 && (
            <div className="flex justify-between w-[50%] py-1">
              <div>{lang.discount}:</div>
              <div>-{formatCurrency(data.discount)} {data.currency}</div>
            </div>
          )}
          {data.shipping > 0 && (
            <div className="flex justify-between w-[50%] py-1">
              <div>{lang.shipping}:</div>
              <div>{formatCurrency(data.shipping)} {data.currency}</div>
            </div>
          )}
          {data.adjustment !== 0 && (
            <div className="flex justify-between w-[50%] py-1">
              <div>{lang.adjustment}:</div>
              <div>{data.adjustment > 0 ? "+" : ""}{formatCurrency(data.adjustment)} {data.currency}</div>
            </div>
          )}
          <div className="flex justify-between w-[50%] py-1 mt-1 border-t border-[#000] font-bold text-sm">
            <div>{lang.total}:</div>
            <div>{formatCurrency(total)} {data.currency}</div>
          </div>
          {data.taxType === "inclusive" && (
            <div className="flex justify-between w-[50%] py-1 text-[8px] text-[#666]">
              <div>Includes Tax: {formatCurrency(totalTax)} {data.currency}</div>
            </div>
          )}
        </div>

        {data.terms && (
          <div className="mt-8 text-[9px] text-[#666] border-t border-[#eee] pt-2 whitespace-pre-wrap">
            <span className="font-bold">{lang.terms}:</span> {data.terms}
          </div>
        )}
      </div>
    </div>
  );
};
export function FactureGenerator() {
  const [data, setData] = useState<FactureData>(() => storage.get("facture_data_v1", defaultData));
  const debouncedData = useDebounce(data, 500);
  const [instance, updateInstance] = usePDF({ document: <FacturePDF data={debouncedData} /> });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const previewRef = useRef<HTMLDivElement>(null);
  const [newContact, setNewContact] = useState({ name: "", email: "" });
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    storage.set("facture_data_v1", data);
  }, [data]);

  useEffect(() => {
    updateInstance(<FacturePDF data={debouncedData} />);
  }, [debouncedData, updateInstance]);

  const updateField = (field: keyof FactureData, value: any) => setData(prev => ({ ...prev, [field]: value }));
  
  const updateItem = (index: number, field: keyof FactureItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateField("items", newItems);
  };

  const addItem = () => updateField("items", [...data.items, { desc: "", qty: 1, price: 0, tax: 0 }]);
  const removeItem = (index: number) => updateField("items", data.items.filter((_, i) => i !== index));

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

  const addContact = () => {
    if (newContact.name && newContact.email) {
      setData(prev => ({ ...prev, contacts: [...prev.contacts, newContact] }));
      setNewContact({ name: "", email: "" });
      setShowContactForm(false);
    }
  };

  const removeContact = (index: number) => {
    setData(prev => ({ ...prev, contacts: prev.contacts.filter((_, i) => i !== index) }));
  };

  const lang = t[data.lang];

  const handleDownloadPNG = async () => {
    if (!instance.url) return;
    try {
      const res = await fetch(instance.url);
      const arrayBuffer = await res.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      // @ts-ignore
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `${data.factureNum}.png`);
      });
    } catch (err) {
      console.error("Failed to generate PNG", err);
    }
  };

  const handleDownloadWord = async () => {
    const calculateItemAmount = (item: FactureItem) => {
      const base = item.qty * item.price;
      if (data.taxType === "exclusive") {
        return base + (base * (item.tax / 100));
      }
      return base;
    };
    const children: any[] = [];
    
    if (data.logo) {
      try {
        const res = await fetch(data.logo);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        children.push(new Paragraph({
          children: [
            new ImageRun({
              data: arrayBuffer,
              transformation: { width: 100, height: 100 },
              type: "png"
            })
          ]
        }));
      } catch (err) {
        console.error("Failed to add logo to word doc", err);
      }
    }

    children.push(
      new Paragraph({ children: [new TextRun({ text: lang.quote, bold: true, size: 48 })] }),
      new Paragraph({ text: `${lang.factureNum}: ${data.factureNum}` }),
      new Paragraph({ text: `${lang.date}: ${data.date}` }),
      new Paragraph({ text: "" }),
      new Paragraph({ children: [new TextRun({ text: lang.billingAddress, bold: true })] }),
      new Paragraph({ text: data.toName }),
      new Paragraph({ text: data.toBillingAddress }),
      ...(data.customerInfo ? [
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: lang.customerInfo, bold: true })] }),
        new Paragraph({ text: data.customerInfo }),
      ] : []),
      new Paragraph({ text: "" }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lang.itemDetails, bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lang.qty, bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lang.rate, bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: lang.amount, bold: true })] })] }),
            ],
          }),
          ...data.items.map(item => new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(item.desc)] }),
              new TableCell({ children: [new Paragraph(item.qty.toString())] }),
              new TableCell({ children: [new Paragraph(`${formatCurrency(item.price)} ${data.currency}`)] }),
              new TableCell({ children: [new Paragraph(`${formatCurrency(calculateItemAmount(item))} ${data.currency}`)] }),
            ]
          }))
        ]
      })
    );

    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: children,
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${data.factureNum}.docx`);
    });
  };

  const handlePrint = () => {
    if (instance.url) {
      window.open(instance.url, '_blank');
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">{lang.quote}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create professional factures instantly.</p>
          </div>
          <div className="flex items-center gap-2">
            <ProjectManager
              storageKey="facture_projects_v1"
              currentData={data}
              onLoad={(newData) => setData(newData)}
              titleExtractor={(d) => d.factureNum}
              typeLabel="Facture"
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
                        <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                          Replace Logo
                        </Button>
                        <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="removeBg"
                          checked={data.removeLogoBg} 
                          onChange={e => toggleRemoveBg(e.target.checked)} 
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:checked:bg-zinc-50"
                        />
                        <Label htmlFor="removeBg" className="text-sm cursor-pointer">{lang.removeBg || "Remove White Background"}</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Document Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>{lang.factureNum}</Label><Input value={data.factureNum} onChange={e => updateField("factureNum", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.referenceNum}</Label><Input value={data.referenceNum} onChange={e => updateField("referenceNum", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.currency}</Label><Input value={data.currency} onChange={e => updateField("currency", e.target.value)} placeholder="EUR, USD..." /></div>
              <div className="space-y-2"><Label>{lang.date}</Label><Input type="date" value={data.date} onChange={e => updateField("date", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.dueDate}</Label><Input type="date" value={data.dueDate} onChange={e => updateField("dueDate", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.salesperson}</Label><Input value={data.salesperson} onChange={e => updateField("salesperson", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.projectName}</Label><Input value={data.projectName} onChange={e => updateField("projectName", e.target.value)} /></div>
              <div className="space-y-2">
                <Label>{lang.taxType}</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  value={data.taxType}
                  onChange={(e) => updateField("taxType", e.target.value as "exclusive" | "inclusive")}
                >
                  <option value="exclusive">{lang.taxExclusive}</option>
                  <option value="inclusive">{lang.taxInclusive}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Your Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{lang.fromName}</Label><Input value={data.fromName} onChange={e => updateField("fromName", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.fromAddress}</Label><Input value={data.fromAddress} onChange={e => updateField("fromAddress", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{lang.customerInfo}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{lang.customerName}</Label><Input value={data.toName} onChange={e => updateField("toName", e.target.value)} /></div>
              <div className="hidden md:block"></div>
              <div className="space-y-2"><Label>{lang.billingAddress}</Label><Input value={data.toBillingAddress} onChange={e => updateField("toBillingAddress", e.target.value)} /></div>
              <div className="space-y-2"><Label>{lang.shippingAddress}</Label><Input value={data.toShippingAddress} onChange={e => updateField("toShippingAddress", e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>{lang.customerInfo} (Notes)</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                  value={data.customerInfo} 
                  onChange={e => updateField("customerInfo", e.target.value)} 
                  placeholder="Notes for the client..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{lang.itemDetails}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-4 w-4 mr-1"/> {lang.addNewLine}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.items.map((item, i) => (
                <motion.div layout key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col md:flex-row md:items-end gap-2 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50">
                  <div className="flex-1 space-y-2"><Label>{lang.itemDetails}</Label><Input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} /></div>
                  <div className="flex flex-wrap md:flex-nowrap gap-2">
                    <div className="w-20 space-y-2"><Label>{lang.qty}</Label><Input type="number" value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} /></div>
                    <div className="w-24 space-y-2"><Label>{lang.rate}</Label><Input type="number" value={item.price} onChange={e => updateItem(i, "price", Number(e.target.value))} /></div>
                    <div className="w-20 space-y-2"><Label>{lang.tax}</Label><Input type="number" value={item.tax} onChange={e => updateItem(i, "tax", Number(e.target.value))} /></div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 mt-6 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </motion.div>
              ))}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2"><Label>{lang.discount}</Label><Input type="number" value={data.discount} onChange={e => updateField("discount", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>{lang.shipping}</Label><Input type="number" value={data.shipping} onChange={e => updateField("shipping", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>{lang.adjustment}</Label><Input type="number" value={data.adjustment} onChange={e => updateField("adjustment", Number(e.target.value))} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{lang.terms}</CardTitle></CardHeader>
            <CardContent>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                value={data.terms}
                onChange={e => updateField("terms", e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{lang.emailComms}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowContactForm(!showContactForm)}>
                <Plus className="h-4 w-4 mr-1"/> {lang.addNewContact}
              </Button>
            </CardHeader>
            <CardContent>
              {showContactForm && (
                <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowContactForm(false)}>Cancel</Button>
                    <Button size="sm" onClick={addContact}>Add Contact</Button>
                  </div>
                </div>
              )}

              {data.contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl">
                  <Mail className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">{lang.noContactFound}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.contacts.map((contact, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-zinc-500">{contact.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => removeContact(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 px-2.5 sm:px-3 text-xs bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5"/> {lang.print}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadWord} className="h-8 px-2.5 sm:px-3 text-xs bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-xs">
              <FileText className="w-3.5 h-3.5 mr-1.5"/> Word
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPNG} className="h-8 px-2.5 sm:px-3 text-xs bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-xs">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5"/> PNG
            </Button>
            <Button size="sm" className="h-8 px-2.5 sm:px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs" onClick={() => {
              if (instance.url) {
                const link = document.createElement('a');
                link.href = instance.url;
                link.download = `${data.factureNum}.pdf`;
                link.click();
              }
            }}>
              {instance.url ? (
                <><Download className="w-3.5 h-3.5 mr-1.5"/> PDF</>
              ) : (
                <><Loader2 className="h-3.5 h-3.5 mr-1.5 animate-spin" /> {data.lang === "fr" ? "Génération..." : "Generating..."}</>
              )}
            </Button>
          </div>
        </div>

        <A4PreviewWrapper>
          <LiveFacturePreview data={data} />
        </A4PreviewWrapper>
      </div>
    </motion.div>
  );
}
