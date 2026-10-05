import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Key, Hash, Link as LinkIcon, Code } from 'lucide-react';
import { motion } from 'motion/react';

const tools = [
  {
    title: 'Base64 Encode/Decode',
    description: 'Use this tool to encode/decode base64.',
    icon: Code,
    href: '/encryption-tools/base64',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'MD5 Hash',
    description: 'Use this tool to generate MD5 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/md5-hash',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    title: 'MD5 Decrypt',
    description: 'Use this tool to decrypt MD5 hashes.',
    icon: Key,
    href: '/encryption-tools/md5-decrypt',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    title: 'SHA1 Hash',
    description: 'Use this tool to generate SHA1 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/sha1-hash',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'SHA1 Decrypt',
    description: 'Use this tool to decrypt SHA1 hashes.',
    icon: Key,
    href: '/encryption-tools/sha1-decrypt',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'SHA256 Hash',
    description: 'Use this tool to generate SHA256 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/sha256-hash',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    title: 'SHA256 Decrypt',
    description: 'Use this tool to decrypt SHA256 hashes.',
    icon: Key,
    href: '/encryption-tools/sha256-decrypt',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    title: 'SHA384 Hash',
    description: 'Use this tool to generate SHA384 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/sha384-hash',
    color: 'bg-rose-500/10 text-rose-500',
  },
  {
    title: 'SHA384 Decrypt',
    description: 'Use this tool to decrypt SHA384 hashes.',
    icon: Key,
    href: '/encryption-tools/sha384-decrypt',
    color: 'bg-rose-500/10 text-rose-500',
  },
  {
    title: 'SHA512 Hash',
    description: 'Use this tool to generate SHA512 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/sha512-hash',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    title: 'SHA512 Decrypt',
    description: 'Use this tool to decrypt SHA512 hashes.',
    icon: Key,
    href: '/encryption-tools/sha512-decrypt',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    title: 'AES Encrypt',
    description: 'Use this tool to generate AES hashes from text.',
    icon: Shield,
    href: '/encryption-tools/aes-encrypt',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: 'AES Decrypt',
    description: 'Use this tool to decrypt AES hashes.',
    icon: Key,
    href: '/encryption-tools/aes-decrypt',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: 'DES Encrypt',
    description: 'Use this tool to generate DES hashes from text.',
    icon: Shield,
    href: '/encryption-tools/des-encrypt',
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'DES Decrypt',
    description: 'Use this tool to decrypt DES hashes.',
    icon: Key,
    href: '/encryption-tools/des-decrypt',
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'RIPEMD160 Encrypt',
    description: 'Use this tool to generate RIPEMD160 hashes from text.',
    icon: Hash,
    href: '/encryption-tools/ripemd160-encrypt',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  {
    title: 'URL Encode',
    description: 'Url Encode is a tool that allows you to encode URL parameters to send data to server.',
    icon: LinkIcon,
    href: '/encryption-tools/url-encode',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'URL Decode',
    description: 'Url Encode is a tool that allows you to decode URL parameters to Plain and readable text.',
    icon: LinkIcon,
    href: '/encryption-tools/url-decode',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'HTML Encode',
    description: 'Html Encode is a tool that allows you to encode plain HTML to encoded html.',
    icon: Code,
    href: '/encryption-tools/html-encode',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'HTML Decode',
    description: 'Html Decode is a tool that allows you to decode html into plain HTML.',
    icon: Code,
    href: '/encryption-tools/html-decode',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
];

export function EncryptionTools() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Encryption Tools</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          A collection of tools for encoding, decoding, hashing, and encrypting data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={tool.href}
              className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{tool.title}</h3>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">{tool.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
