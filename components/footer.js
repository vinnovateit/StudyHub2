"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="h-[9vh] bg-gray-900 text-gray-400 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            {/* Links Section */}
            <div className="flex space-x-4 items-center pl-1 pb-1 md:hidden">
              <ul className="flex space-x-4">
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://vinnovateit.com/"
                    className="text-gray-400"
                  >
                    <Image
                      src="/img/VinnovateIT_small.png"
                      alt=""
                      height={24}
                      width={36}
                      className="max-w-full h-auto"
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/vinnovateit/?hl=en"
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://twitter.com/v_innovate_it?lang=en"
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/vinnovateit"
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </li>
              </ul>
            </div>

            {/* Copyright Section */}
            <div className="mt-2 mx-auto md:ml-auto md:pr-20 text-center md:text-left text-sm">
              <p className="m-0">
                &copy; 2025 -{" "}
                <Link
                  href="https://vinnovateit.com/"
                  className="text-gray-400 hover:text-gray-300"
                >
                  MADE With{" "}
                  <span className="text-red-600 text-[14px]">&#10084;</span>{" "}
                  By VinnovateIT
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
