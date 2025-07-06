// import { FaTwitter, FaYoutube, FaInstagram, FaGithub } from "react-icons/fa";

import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-900 py-10 px-2">
      <nav className="flex flex-col items-center justify-center gap-6">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Компани
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Бидний тухай
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Баг
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Бүтээгдэхүүн
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Блог
            </a>
          </li>
          <li>
            <a href="#" className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors">
              Үнийн санал
            </a>
          </li>
        </ul>
        <div className="flex gap-6 justify-center">
            <a
            href="#"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Instagram"
          >
            <Youtube size={22} />
          </a>
          <a
            href="#"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
          <a
            href="#"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="GitHub"
          >
            <Facebook size={22} />
          </a>
        </div>
        <div className="text-zinc-500 text-center mt-3 text-sm">
          Copyright © 2025 Attila LLC
        </div>
      </nav>
    </footer>
  );
}