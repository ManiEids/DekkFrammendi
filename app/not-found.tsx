import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-4">Síða fannst ekki</h2>
        <p className="mb-8 text-gray-600">Því miður fannst síðan sem þú leitaðir að ekki.</p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          Aftur á forsíðu
        </Link>
      </div>
    </div>
  );
}
