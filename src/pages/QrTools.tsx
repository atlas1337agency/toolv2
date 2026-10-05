import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  QrCode,
  KeyRound,
  Barcode,
  CreditCard,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "QR Code Generator",
    description: "Generate customized QR codes with logos, colors, and different data types.",
    icon: QrCode,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/qr/generator"
  },
  {
    title: "Strong Random Password Generator",
    description: "Generate strong random passwords and check its strength with a password strength meter.",
    icon: KeyRound,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/qr/password"
  },
  {
    title: "Barcode Generator",
    description: "Generate barcodes for different international standardizations with desired sizes.",
    icon: Barcode,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/qr/barcode"
  },
  {
    title: "Fake IBAN Generator",
    description: "Generate fake IBANs for different countries for testing purposes.",
    icon: CreditCard,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/qr/iban"
  },
  {
    title: "Gmail Generator",
    description: "Generate alternative email addresses using Gmail's DOT trick.",
    icon: Mail,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    href: "/qr/gmail-generator"
  }
];

export function QrTools() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-8 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">QR & Security Tools</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          A collection of tools for generating codes, passwords, and test data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={tool.href}>
              <Card className="h-full transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${tool.bgColor}`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
