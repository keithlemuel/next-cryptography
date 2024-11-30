'use client';

import { FileUpload } from "@/components/FileUpload";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { Shield } from "lucide-react";
import { CryptoProvider } from "@/contexts/CryptoContext";

export default function Home() {
  return (
    <CryptoProvider>
      <div className="min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Cryptography Tool</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">File Encryption & Decryption</h1>
              <p className="text-sm text-foreground/60">
                Secure your files using various cryptographic algorithms
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-4">
                <FileUpload />
              </div>
              <div className="card p-4">
                <AlgorithmSelector />
              </div>
            </div>
          </div>
        </main>
      </div>
    </CryptoProvider>
  );
}
