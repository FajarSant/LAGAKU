"use client";

import { Trophy } from "lucide-react";
import { useTheme } from "next-themes";

const Footer = () => {
  const { theme } = useTheme();

  const navigationItems = ["Beranda", "Turnamen", "Tim", "Jadwal"];

  return (
    <footer className="border-t py-10 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/95 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SportConnect
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Competition Hub
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Platform turnamen olahraga terdepan untuk kompetisi yang adil
              dan transparan dengan teknologi modern.
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
              Navigasi
            </h4>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm block py-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
              Kontak
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li className="flex items-start py-1">
                <span className="font-medium mr-2 min-w-16">Email:</span>
                support@sportconnect.id
              </li>
              <li className="flex items-start py-1">
                <span className="font-medium mr-2 min-w-16">Telepon:</span>
                (021) 1234-5678
              </li>
              <li className="flex items-start py-1">
                <span className="font-medium mr-2 min-w-16">Alamat:</span>
                Jakarta, Indonesia
              </li>
            </ul>
          </div>

          {/* Social Links / Additional Section (optional) */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
              Ikuti Kami
            </h4>
            <div className="flex space-x-4">
              {[
                { name: "Facebook", icon: "fb" },
                { name: "Twitter", icon: "tw" },
                { name: "Instagram", icon: "ig" },
                { name: "LinkedIn", icon: "in" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} SportConnect. All rights reserved. |
            Platform Turnamen Modern
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;