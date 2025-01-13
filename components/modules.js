"use client";

import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

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
    <div className="p-4 border border-black text-lg backdrop-blur-xl w-full min-h-[83vh]">
      {modules.map((module) => {
        return (
          <Accordion
            open={open === module.num}
            icon={<Icon id={module.num} open={open} />}
            key={module.num}
            className="rounded-md w-[90vw] mx-auto mb-4"
          >
            <AccordionHeader
              className="px-4 py-3 bg-gray-700 text-white text-sm uppercase tracking-wide hover:bg-gray-800 transition-all"
              onClick={() => handleOpen(module.num)}
            >
              MODULE {module.num}
            </AccordionHeader>
            <AccordionBody className="bg-gray-50 text-gray-700">
              <div className="relative overflow-hidden p-6 bg-center bg-no-repeat bg-contain bg-[url('/img/viitlogo.png')] text-base">
                <span
                  dangerouslySetInnerHTML={{
                    __html: module.sanitizedHtml,
                  }}
                  className="relative z-10"
                />
                <Image
                  src="/img/VinnovateIT_small.png"
                  height={50}
                  width={20}
                  alt="VinnovateIT"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-40"
                />
              </div>
            </AccordionBody>
          </Accordion>
        );
      })}
    </div>
  );
}
