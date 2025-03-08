import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full px-8 text-[#93c5fd] bg-[#0d1321] py-4 pt-2 border-t border-[#93c5fd]">
      {/* VinnovateIT Logo */}
      <div className="flex items-center">
        <Image
          src="/img/VinnovateIT_logo_black 1.png"
          alt="VinnovateIT Logo"
          width={80}
          height={40}
          className="opacity-80 hover:opacity-100 transition"
        />
      </div>

      {/* Social Links */}
      <div className="flex space-x-6">
        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github text-3xl text-[#93c5fd] hover:text-white transition duration-300"></i>
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram text-3xl text-[#93c5fd] hover:text-white transition duration-300"></i>
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-twitter text-3xl text-[#93c5fd] hover:text-white transition duration-300"></i>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
