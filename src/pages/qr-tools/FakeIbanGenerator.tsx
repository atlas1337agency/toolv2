import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Copy, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { faker } from "@faker-js/faker";

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const countries = [
  { code: "AL", name: "Albania" },
  { code: "AD", name: "Andorra" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BH", name: "Bahrain" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GT", name: "Guatemala" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "KW", name: "Kuwait" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "MU", name: "Mauritius" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "ME", name: "Montenegro" },
  { code: "NL", name: "Netherlands" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" },
  { code: "PS", name: "Palestine" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "SM", name: "San Marino" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "RS", name: "Serbia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "VG", name: "Virgin Islands, British" },
];

export function FakeIbanGenerator() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("DE");
  const [iban, setIban] = useState("");
  const [formattedIban, setFormattedIban] = useState("");
  const [copied, setCopied] = useState(false);

  const generateIban = () => {
    try {
      const newIban = faker.finance.iban({ formatted: false, countryCode: country });
      setIban(newIban);
      
      // Format IBAN (groups of 4 characters)
      const formatted = newIban.replace(/(.{4})/g, '$1 ').trim();
      setFormattedIban(formatted);
    } catch (error) {
      console.error("Error generating IBAN:", error);
      setIban("Error generating IBAN for this country");
      setFormattedIban("");
    }
  };

  useEffect(() => {
    generateIban();
  }, [country]);

  const handleCopy = () => {
    if (!iban) return;
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-8 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/qr")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Fake IBAN Generator</h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Generate fake International Bank Account Numbers (IBANs) for testing purposes.
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generated IBAN</CardTitle>
          <CardDescription>
            These IBANs are mathematically valid but do not belong to real bank accounts. Use for testing only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full sm:max-w-md">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="mr-2">{getFlagEmoji(c.code)}</span>
                    {c.name} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-4">
            <Label>IBAN</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                value={formattedIban || iban} 
                readOnly 
                className="text-sm sm:text-lg font-mono tracking-wider h-14 w-full overflow-x-auto"
              />
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" className="h-14 flex-1 sm:flex-none" onClick={generateIban} title="Regenerate">
                  <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                </Button>
                <Button variant="secondary" className="h-14 flex-1 sm:flex-none" onClick={handleCopy} title="Copy">
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            {copied && <p className="text-sm text-emerald-500 mt-2 font-medium">Copied to clipboard!</p>}
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 text-sm text-amber-800 dark:text-amber-200">
            <strong>Disclaimer:</strong> The IBANs generated by this tool are entirely fake and randomly generated. They are designed to pass format validation checks for testing software applications but cannot be used for real financial transactions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
