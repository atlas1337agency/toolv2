import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, DollarSign, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as htmlToImage from 'html-to-image';

export function TwitterAdRevenue() {
  const [amount, setAmount] = useState('12,450.00');
  const [dateRange, setDateRange] = useState('Aug 1 - Aug 31, 2023');
  const [impressions, setImpressions] = useState('45.2M');
  const [status, setStatus] = useState('Paid');
  
  const revenueRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!revenueRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(revenueRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'twitter-revenue.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Twitter Ad Revenue Generator</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Generate fake Twitter ad revenue screenshots.</p>
          </div>
          <Button onClick={downloadImage} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Screenshot
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ($)</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Impressions</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center items-start">
            {/* Twitter Revenue Preview */}
            <div 
              ref={revenueRef}
              className="w-[450px] bg-black border border-zinc-800 rounded-xl p-6 text-white font-sans"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Ads Revenue Sharing</h2>
                <div className="p-2 bg-zinc-900 rounded-full">
                  <DollarSign className="w-5 h-5 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wide">Payout amount</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${amount}</span>
                  <span className="text-zinc-500 font-medium">USD</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Date range</span>
                  <span className="font-medium">{dateRange}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Eligible impressions</span>
                  <span className="font-medium">{impressions}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'Paid' ? 'bg-green-500' : status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <span className="font-medium">{status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-zinc-900 rounded-xl flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold">Manage payout account</p>
                    <p className="text-sm text-zinc-500">Stripe Express</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
