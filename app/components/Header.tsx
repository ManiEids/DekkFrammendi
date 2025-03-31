import Link from 'next/link';
import DekkjaLeitMobile from './DekkjaLeitMobile';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Dekkjasafn
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <DekkjaLeitMobile />

            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-blue-600">
                    Forsíða
                  </Link>
                </li>
                <li>
                  <Link href="/dekk" className="hover:text-blue-600">
                    Dekk
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
