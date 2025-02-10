import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full px-8 text-gray-500 bg-white py-4 bg-gradient-to-r from-blue-50 to-blue-100">
      {/* VinnovateIT Logo */}
      <div className="flex items-center">
        <Image
          src="/img/VinnovateIT_small.png" // Place your VinnovateIT logo in /public/img/
          alt="VinnovateIT Logo"
          width={80}
          height={40}
        />
      </div>

      {/* Social Links */}
      <div className="flex space-x-4">
        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github text-3xl hover:text-black transition"></i>
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram text-3xl hover:text-black transition"></i>
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-twitter text-3xl hover:text-black transition"></i>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
