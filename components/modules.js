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

  const ResourceList = ({ resources, title }) => (
    resources.length > 0 && (
      <div className="mt-4">
        <h4 className="font-bold text-blue-700">{title}</h4>
        <ul className="list-disc pl-5">
          {resources.map((resource, idx) => (
            <li key={idx}>
              <a href={resource.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {resource.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div className={`${ibmPlexMono.className} p-4 mx-auto text-lg backdrop-blur-xl max-w-5xl`}>
      {modules.map((module) => (
        <Accordion
          open={open === module.num}
          icon={<Icon id={module.num} open={open} />}
          key={module.num}
          className="rounded-md w-[80vw] align-center mb-4"
        >
          <AccordionHeader
            className="p-4 bg-blue-700 text-white text-sm md:text-md uppercase tracking-wide hover:bg-blue-900 transition-all"
            onClick={() => handleOpen(module.num)}
          >
            MODULE {module.num}
          </AccordionHeader>
          <AccordionBody className="bg-gradient-to-br from-white to-blue-200 text-black">
            <div className="relative overflow-hidden p-6 text-base">
              <h3 className="font-bold text-xl mb-2">{module.title}</h3>
              <p className="mb-4">{module.description}</p>
              
              {module.topics.map((topic, idx) => (
                <div key={idx} className="mb-6 border-l-2 border-blue-500 pl-4">
                  <h4 className="font-bold text-lg text-blue-800">{topic.name}</h4>
                  {topic.description && <p className="mb-2">{topic.description}</p>}
                  <ResourceList resources={topic.pdfs} title="PDFs" />
                  <ResourceList resources={topic.links} title="Links" />
                  <ResourceList resources={topic.videos} title="Videos" />
                </div>
              ))}

              <div className="mt-6 border-t pt-4">
                <ResourceList resources={module.pdfs} title="Module PDFs" />
                <ResourceList resources={module.links} title="Module Links" />
                <ResourceList resources={module.videos} title="Module Videos" />
              </div>
            </div>
          </AccordionBody>
        </Accordion>
      ))}
    </div>
  );
}
