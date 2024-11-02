"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function SearchInput({
  searchDefValue,
}: {
  searchDefValue: string | string[] | undefined;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const onSearchField = () => {
    const val = searchRef.current?.value;
    if (!val || val.length <= 0) {
      router.push("/");
    } else {
      router.push("?search=" + val);
    }
  };

  return (
    <div className="flex flex-row gap-2 mt-4">
      <div className="flex-1">
        <input
          type="text"
          ref={searchRef}
          defaultValue={searchDefValue}
          placeholder="Search student by email address..."
          onKeyUp={(ev) => {
            if (ev.code == "Enter") {
              onSearchField();
            }
          }}
          onChange={(ev) => {
            const fieldVal = ev.currentTarget.value;
            if ((!fieldVal || fieldVal.length <= 0) && searchDefValue) {
              onSearchField();
            }
          }}
          className="w-full border border-gray-500 px-2 py-1 rounded-md focus:border-blue-500 outline-none"
        />
      </div>
      <button
        onClick={() => onSearchField()}
        className="border text-white border-gray-300 bg-blue-500 px-2 rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        🔍 SEARCH
      </button>
    </div>
  );
}
