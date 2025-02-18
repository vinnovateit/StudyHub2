"use client";

import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { IBM_Plex_Mono} from "next/font/google";

// Import Fonts
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform float-right mx-1`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function Modules({ modules }) {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className={`${ibmPlexMono.className} p-4 mx-auto text-lg backdrop-blur-xl max-w-5xl`}>
      {modules.map((module) => {
        return (
          <Accordion
            open={open === module.num}
            icon={<Icon id={module.num} open={open} />}
            key={module.num}
            className="rounded-md w-[80vw] align-center"
          >
            <AccordionHeader
              className="p-4 bg-blue-700 text-white text-sm md:text-md uppercase tracking-wide hover:bg-blue-900 transition-all"
              onClick={() => handleOpen(module.num)}
            >
              MODULE {module.num}
            </AccordionHeader>
            <AccordionBody className="bg-gradient-to-br from-white to-blue-200 text-black">
              <div className="relative overflow-hidden p-6 text-base">
                <span
                  dangerouslySetInnerHTML={{
                    __html: module.sanitizedHtml,
                  }}
                  className="relative z-10"
                />
              </div>
            </AccordionBody>
          </Accordion>
        );
      })}
    </div>
  );
}
