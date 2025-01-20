"use client";

import dynamic from "next/dynamic";

const DoodleComponent = ({ rule = "" }) => {
    return <css-doodle>{rule}</css-doodle>;
};

const Doodle = dynamic(() => {
    import("css-doodle");
    return Promise.resolve(DoodleComponent);
}, { ssr: false });

export default Doodle;

