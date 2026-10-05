import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, CheckCircle2, ArrowLeft, Mail, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function GmailGenerator() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateAliases = () => {
    if (!email || !email.includes("@")) return;

    const [localPart, domain] = email.split("@");

    // Remove existing dots to get the base string
    const baseLocal = localPart.replace(/\./g, "");
    const n = baseLocal.length;
    
    // If the local part is too long, generating 2^(n-1) can crash the browser.
    // Limit to 15 characters (16384 combinations) max for safety.
    const safeLength = Math.min(n, 15);
    const safeLocal = baseLocal.substring(0, safeLength);
    const remainder = baseLocal.substring(safeLength);

    const numCombinations = Math.pow(2, safeLength - 1);
    const results: string[] = [];

    for (let i = 0; i < numCombinations; i++) {
      let currentAlias = safeLocal[0];
      for (let j = 0; j < safeLength - 1; j++) {
        // Check if the j-th bit is set
        if ((i & (1 << j)) !== 0) {
          currentAlias += ".";
        }
        currentAlias += safeLocal[j + 1];
      }
      results.push(`${currentAlias}${remainder}@${domain}`);
    }

    // Sort by number of dots (optional, but makes it look like the example)
    results.sort((a, b) => {
      const dotsA = (a.match(/\./g) || []).length;
      const dotsB = (b.match(/\./g) || []).length;
      return dotsA - dotsB;
    });

    setAliases(results);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(aliases.join("\n"));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (format: string) => {
    if (aliases.length === 0) return;

    const data = aliases.map((alias) => ({ Email: alias }));

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("Generated Gmail Aliases", 14, 15);
      autoTable(doc, {
        head: [["#", "Email Alias"]],
        body: aliases.map((alias, i) => [i + 1, alias]),
        startY: 20,
      });
      doc.save("gmail-aliases.pdf");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aliases");

    switch (format) {
      case "xlsx":
        XLSX.writeFile(workbook, "gmail-aliases.xlsx");
        break;
      case "ods":
        XLSX.writeFile(workbook, "gmail-aliases.ods");
        break;
      case "csv":
        XLSX.writeFile(workbook, "gmail-aliases.csv");
        break;
      case "tsv":
        XLSX.writeFile(workbook, "gmail-aliases.txt", { bookType: "txt" });
        break;
      case "html":
        XLSX.writeFile(workbook, "gmail-aliases.html");
        break;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-8 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/qr")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Gmail Generator</h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Generate alternative email addresses using Gmail's DOT trick.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              All emails sent to these aliases will appear in your main inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Your Gmail Address</Label>
              <Input 
                type="email"
                placeholder="support@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateAliases()}
              />
            </div>
            <Button onClick={generateAliases} className="w-full">
              Generate Aliases
            </Button>
            
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4 text-sm text-zinc-500 dark:text-zinc-400">
              <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">How it works:</p>
              <p className="mb-3">Gmail ignores dots (.) in the username. Adding dots creates unique aliases that all deliver to your main inbox.</p>
              <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">Examples:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>paul.buchheit@gmail.com</li>
                <li>generator@gmail.com</li>
                <li>generator@googlemail.com</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] max-h-[800px]">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">Generated Aliases</CardTitle>
              <CardDescription className="truncate">
                {aliases.length > 0 ? `Number of possible aliases: ${aliases.length}` : "Enter an email to generate aliases"}
              </CardDescription>
            </div>
            {aliases.length > 0 && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-2">
                  {copiedIndex === -1 ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  Copy All
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload("xlsx")}>Excel (.xlsx)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload("pdf")}>PDF (.pdf)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload("ods")}>OpenDocument (.ods)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload("csv")}>CSV (.csv)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload("tsv")}>TSV (.tsv)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload("html")}>HTML (.html)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {aliases.length > 0 ? (
              <div className="space-y-2">
                {aliases.length > 500 && (
                  <div className="p-3 mb-4 text-sm text-amber-800 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    Showing the first 500 aliases. Please download the list to see all {aliases.length} aliases.
                  </div>
                )}
                {aliases.slice(0, 500).map((alias, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 sm:p-3 gap-2"
                  >
                    <span className="font-mono text-xs sm:text-sm truncate flex-1" title={alias}>{alias}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(alias, index)}
                      className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-500" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400">
                <Mail className="mb-4 h-12 w-12 opacity-20" />
                <p>Your generated aliases will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
