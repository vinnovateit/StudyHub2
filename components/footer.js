import Image from "next/image";
import Link from "next/link";
import { Github, Instagram, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full px-8 text-[#93c5fd] bg-[#1E1E1E] py-4 pt-2 border-t border-[#93c5fd]">
      {/* VinnovateIT Logo */}
      <div className="flex items-center">
        <Image
          src="/whiteLogoViit.svg"
          alt="VinnovateIT Logo"
          width={80}
          height={50}
          className="opacity-80 hover:opacity-100 transition"
        />
      </div>

      {/* Social Links */}
      <div className="flex space-x-6">
        <Link
          href="https://github.com/vinnovateit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="w-8 h-8 text-[#93c5fd] hover:text-white transition duration-300" />
        </Link>

        <Link
          href="https://www.instagram.com/vinnovateit/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="w-8 h-8 text-[#93c5fd] hover:text-white transition duration-300" />
        </Link>

        <Link
          href="https://x.com/v_innovate_it?lang=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <X className="w-8 h-8 text-[#93c5fd] hover:text-white transition duration-300" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
