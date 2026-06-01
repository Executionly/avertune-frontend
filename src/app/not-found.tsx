import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-6">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-violet-400">
          <path d="M16 4C10.477 4 6 8.477 6 14c0 3.5 1.8 6.6 4.5 8.4V26h11v-3.6C24.2 20.6 26 17.5 26 14c0-5.523-4.477-10-10-10z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 26v2M20 26v2" strokeLinecap="round"/>
          <path d="M13 14c0-1.657 1.343-3 3-3s3 1.343 3 3" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="font-display font-medium text-[64px] text-navy-900 leading-none mb-4">404</h1>
      <p className="text-xl text-navy-500 mb-2">Page not found</p>
      <p className="text-[15px] text-navy-400 max-w-[380px] mb-8">
        This page doesn&apos;t exist. Let Avertune help you navigate to the right place.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="h-12 px-8 text-base rounded-xl bg-violet-500 text-white font-medium inline-flex items-center hover:bg-violet-600 transition-colors">
          Back to Home
        </Link>
        <Link href="/app" className="h-12 px-8 text-base rounded-xl bg-white border border-navy-200 text-navy-800 font-medium inline-flex items-center hover:border-violet-400 transition-colors">
          Open App
        </Link>
      </div>
    </div>
  );
}
