import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  return (
    <div className="relative dark:bg-blue-lightDark px-2 rounded-xl">
      <p className="absolute inset-0 text-white opacity-30 text-2xl tracking-widest font-bold flex justify-center items-center">
        DEVELOPER
      </p>
      <div className="relative h-10 flex items-center justify-between z-10">
        <a href="https://iam-abhi.site/" className="flex items-center gap-2" target="_blank"
            rel="noopener noreferrer">
          <img src="/asset/Logo.png" alt="logo" className="h-8" />
          <p className="text-blue-light text-sm">Abhishek Kumar</p>
        </a>
        <div className="flex items-center gap-3 text-lg text-gray-300">
          <a
            href="https://www.linkedin.com/in/iamabhi0619/"
            title="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 transition-all duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/iamabhi0619"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 transition-all duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.instagram.com/_kumar._.abhishek/"
            title="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-125 transition-all duration-300"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
