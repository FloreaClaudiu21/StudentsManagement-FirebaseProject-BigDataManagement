/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SearchInput from "./SearchInput";
import { Student } from "../types/Student";
import StudentCard from "./StudentCard";
import Image from "next/image";

export default function StudentsList({
  search,
  docsFound,
  studList,
}: {
  docsFound: boolean;
  studList: any;
  search: string | undefined;
}) {
  return (
    <div className="w-full flex flex-col gap-4 h-full flex-1 my-14 mt-16 px-4 max-w-screen-lg mx-auto">
      <SearchInput searchDefValue={search} />
      {!docsFound ? (
        <div className="flex flex-col justify-start place-items-center flex-1">
          <Image
            src="/no-results.webp"
            alt="No Results"
            width={450}
            height={300}
            className="object-fill"
          />
          <p className="text-xl font-serif">
            No results found, start by adding students...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-1 mt-2">
          <p className="col-span-3 text-xl border-b-2 border-b-blue-500">
            Results found: {studList.docs.length}{" "}
          </p>
          {studList.docs.map((doc: any) => {
            let studData = doc.data() as Student;
            studData = {
              ...studData,
              createdAt: studData.createdAt?.toString(),
              birthDate: studData.birthDate?.toString(),
            } as Student;
            return (
              <StudentCard key={doc.id} studId={doc.id} studData={studData} />
            );
          })}
        </div>
      )}
    </div>
  );
}
