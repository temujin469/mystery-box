import React from "react";
import Link from "next/link";
import { Youtube, Instagram, Facebook } from "lucide-react";

type Props = {};

function FooterMinimal({}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-gray-900 via-slate-900 to-gray-900/95 border-t border-gray-800/50 backdrop-blur-sm">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-2">
            <Link href="/" className="group">
              <div className="relative">
                {/* Logo background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Logo container */}
                <h2 className="text-xl mb-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-mono tracking-wider">
                  MysteryBox
                </h2>
              </div>
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {/* YouTube */}
            <Link
              href="#"
              className="group relative p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-red-500/50 transition-all duration-200 hover:bg-red-500/10"
            >
              <Youtube className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
              <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>

            {/* Instagram */}
            <Link
              href="#"
              className="group relative p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-pink-500/50 transition-all duration-200 hover:bg-pink-500/10"
            >
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors duration-200" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>

            {/* Facebook */}
            <Link
              href="#"
              className="group relative p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-200 hover:bg-blue-500/10"
            >
              <Facebook className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
              <div className="absolute inset-0 bg-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full max-w-sm mx-auto">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-700/60 to-transparent relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm font-medium">
              © {currentYear} MysteryBox.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
              <Link
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Үйлчилгээний нөхцөл
              </Link>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <Link
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Нууцлалын бодлого
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </footer>
  );
}

export default FooterMinimal;
