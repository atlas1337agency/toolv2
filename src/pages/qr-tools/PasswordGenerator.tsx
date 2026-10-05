import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Copy, RefreshCw, ShieldCheck, ShieldAlert, Shield, ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import zxcvbn from "zxcvbn";

export function PasswordGenerator() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState<number | "">(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState({ score: 0, feedback: { warning: "", suggestions: [] } });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charset = "";
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    // Ensure at least one of each selected type
    if (includeUppercase) newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (includeLowercase) newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (includeNumbers) newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) newPassword += symbols[Math.floor(Math.random() * symbols.length)];

    const len = typeof length === 'number' ? length : 8;
    for (let i = newPassword.length; i < len; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(newPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength({ score: result.score, feedback: result.feedback });
    } else {
      setStrength({ score: 0, feedback: { warning: "", suggestions: [] } });
    }
  }, [password]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    switch (strength.score) {
      case 0:
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-emerald-500";
      default: return "bg-zinc-200 dark:bg-zinc-800";
    }
  };

  const getStrengthLabel = () => {
    switch (strength.score) {
      case 0:
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setLength("");
      return;
    }
    let val = parseInt(e.target.value);
    if (isNaN(val)) return;
    if (val > 128) val = 128;
    setLength(val);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-8 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/qr")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Strong Password Generator</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Generate secure, random passwords and test their strength.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-200">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <p>
          <strong>Passwords are generated on client side only.</strong> There will be no network requests while generating passwords. This provides a more secure environment since the password is not created on a server which may store it and use it for other purposes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input 
              value={password} 
              readOnly 
              className="pr-24 text-lg font-mono tracking-wider h-14"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <Button variant="ghost" size="icon" onClick={generatePassword} title="Regenerate">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleCopy} title="Copy">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Password Strength: {getStrengthLabel()}</span>
              {copied && <span className="text-emerald-500 font-medium">Copied to clipboard!</span>}
            </div>
            <div className="flex gap-1 h-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-colors ${i < strength.score ? getStrengthColor() : 'bg-zinc-200 dark:bg-zinc-800'}`} 
                />
              ))}
            </div>
            {strength.feedback.warning && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> {strength.feedback.warning}
              </p>
            )}
          </div>

          <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Password Length</Label>
                <Input 
                  type="number" 
                  value={length} 
                  onChange={handleLengthChange}
                  onBlur={() => {
                    if (length === "" || length < 8) setLength(8);
                  }}
                  className="w-20 h-8 text-right"
                  min={8}
                  max={128}
                />
              </div>
              <Slider 
                value={[typeof length === 'number' ? Math.max(8, Math.min(128, length)) : 8]} 
                onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} 
                min={8} 
                max={128} 
                step={1} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
                <Label htmlFor="uppercase" className="flex-1 cursor-pointer">Uppercase (A-Z)</Label>
                <Switch 
                  id="uppercase" 
                  checked={includeUppercase} 
                  onCheckedChange={setIncludeUppercase} 
                  disabled={!includeLowercase && !includeNumbers && !includeSymbols}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
                <Label htmlFor="lowercase" className="flex-1 cursor-pointer">Lowercase (a-z)</Label>
                <Switch 
                  id="lowercase" 
                  checked={includeLowercase} 
                  onCheckedChange={setIncludeLowercase} 
                  disabled={!includeUppercase && !includeNumbers && !includeSymbols}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
                <Label htmlFor="numbers" className="flex-1 cursor-pointer">Numbers (0-9)</Label>
                <Switch 
                  id="numbers" 
                  checked={includeNumbers} 
                  onCheckedChange={setIncludeNumbers} 
                  disabled={!includeUppercase && !includeLowercase && !includeSymbols}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
                <Label htmlFor="symbols" className="flex-1 cursor-pointer">Symbols (!@#$)</Label>
                <Switch 
                  id="symbols" 
                  checked={includeSymbols} 
                  onCheckedChange={setIncludeSymbols} 
                  disabled={!includeUppercase && !includeLowercase && !includeNumbers}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
