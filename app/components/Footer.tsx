import React from "react";

export default function Footer() {
  return (
    <div className="bg-black w-full h-12 shadow-md text-white font-serif text-center flex place-items-center justify-center">
      <span>
        © {new Date().getFullYear()} Firebase Project - Big Data. All rights
        reserved.
      </span>
    </div>
  );
}
