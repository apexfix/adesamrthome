import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">SmartLock</h3>
            <p className="text-sm text-gray-500">
              Providing the safest smart lock solutions. Protect your home, enjoy smart living.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-black">Fingerprint Lock</Link></li>
              <li><Link href="/products" className="hover:text-black">Face ID Lock</Link></li>
              <li><Link href="/products" className="hover:text-black">Keypad Lock</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/contact" className="hover:text-black">Contact Us</Link></li>
              <li>Tel: 0493343981</li>
              <li>Email: smarthomeade@gmail.com</li>
              <li>Address: South Australia</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SmartLock. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
