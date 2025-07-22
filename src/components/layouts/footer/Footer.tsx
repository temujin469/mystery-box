"use client";

import { Facebook, Instagram, Youtube, Heart, Sparkles, BoxIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = [
  { name: "Компани", href: "/about" },
  { name: "Бидний тухай", href: "/about" },
  { name: "Баг", href: "/team" },
  { name: "Бүтээгдэхүүн", href: "/products" },
  { name: "Блог", href: "/blog" },
  { name: "Үнийн санал", href: "/pricing" },
];

const socialLinks = [
  { 
    name: "YouTube", 
    icon: Youtube, 
    href: "#", 
    color: "hover:text-red-400",
    bgColor: "hover:bg-red-500/20"
  },
  { 
    name: "Instagram", 
    icon: Instagram, 
    href: "#", 
    color: "hover:text-pink-400",
    bgColor: "hover:bg-pink-500/20"
  },
  { 
    name: "Facebook", 
    icon: Facebook, 
    href: "#", 
    color: "hover:text-blue-400",
    bgColor: "hover:bg-blue-500/20"
  },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden">
      {/* Background with glassmorphism - Darker theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/98 via-slate-900/98 to-black/98 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-slate-800/15 to-gray-900/10" />
      
      {/* Static gradient border - removed animation */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
      
      {/* Reduced floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/10 rounded-full"
            animate={{
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
              scale: [0, 0.5, 0],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30">
                <BoxIcon size={28} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                ATTILA
              </h3>
            </div>
          </motion.div>

          {/* Navigation Links - Simple Grid for All Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <nav>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-4xl mx-auto">
                {footerLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full"
                  >
                    <Link 
                      href={link.href} 
                      className="relative group block text-center py-3 px-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 transition-all duration-200 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-6 mb-12"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                className={`relative group p-3 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 text-gray-400 transition-all duration-200 ${social.color} ${social.bgColor} hover:border-opacity-80`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                aria-label={social.name}
              >
                <social.icon size={18} />
                
                {/* Colorful glow effect on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-blue-500/15 to-purple-500/15" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gray-900 rounded-full w-[30px] h-[30px] flex items-center justify-center">
                <Sparkles className="text-blue-400" size={14} />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              Copyright © 2025 Attila LLC. Made with 
              <Heart className="text-red-400" size={12} fill="currentColor" />
            </p>
          </motion.div>

          {/* Decorative elements - reduced */}
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
          <div className="absolute top-8 right-8 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
        </div>
      </div>
    </footer>
  );
}