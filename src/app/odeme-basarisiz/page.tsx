import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OdemeBasarisizPage({
  searchParams
}: {
  searchParams: { reason?: string; code?: string }
}) {
  const reason = searchParams?.reason || 'Bilinmeyen hata';
  const code = searchParams?.code || '';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Ödeme Başarısız
        </h1>
        
        <p className="text-gray-600 mb-6">
          {decodeURIComponent(reason)}
        </p>
        {code && (
          <p className="text-xs text-gray-400 mb-4 font-mono">Kod: {decodeURIComponent(code)}</p>
        )}
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/iletisim">Destek Al</Link>
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Sorun devam ederse lütfen destek ekibimizle iletişime geçin.
        </p>
      </div>
    </div>
  );
}
