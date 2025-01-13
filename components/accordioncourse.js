"use client";

import React from "react";
import Image from "next/image";
import { useEffect } from "react";
import jQueryAccordion from "@/utils/accordion";

const AccordionCourse = ({ modules }) => {
  useEffect(jQueryAccordion);

  return (
    <div className="font-[1.3rem] w-[90vw] mx-auto rounded-md js-accordion">
      {modules.map((module) => (
        <div
          className="border-b border-white js-accordion-item"
          key={module.num}
        >
          <div
            className="p-[1.45em] bg-[#4C4E50] text-white cursor-pointer text-[0.7em] uppercase tracking-[0.1em] transition-all hover:bg-[#272829] js-accordion-header"
          >
            MODULE {module.num}{" "}
            <i className="fas fa-angle-down float-right"></i>
          </div>
          <div className="hidden bg-[#fcfcfc] text-[#353535] js-accordion-body">
            <div
              className="p-[1.5em] text-[0.7em] relative overflow-hidden bg-center bg-no-repeat bg-contain bg-[url('/img/viitlogo.png')]"
            >
              <span
                className="relative z-10"
                dangerouslySetInnerHTML={{
                  __html: module.sanitizedHtml,
                }}
              />
              <Image
                src="/img/VinnovateIT_small.png"
                height={50}
                width={20}
                alt="VinnovateIT"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto opacity-40 pointer-events-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionCourse;
