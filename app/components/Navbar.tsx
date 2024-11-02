"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useLoginModal } from "../lib/states";
import { auth } from "../lib/firebase";
import { LogOutIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const isLogged = auth.currentUser != null;
  const curUser = auth.currentUser;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.refresh();
      }
    });
  }, []);
  return (
    <nav className="flex fixed top-0 w-full h-auto shadow-lg bg-white py-1 z-50">
      <div className="flex flex-row flex-wrap w-full max-w-screen-lg mx-auto gap-1 px-4">
        <div className="flex flex-row place-items-center gap-1">
          <Image
            src={"/logo.jfif"}
            alt="No Logo"
            width={96}
            height={48}
            className="h-12 rounded-sm"
          />
          <div className="flex flex-col gap-[2px]">
            <p className="text-md text-blue-500">Student&apos;s Management</p>
            <p className="text-sm text-gray-500">
              Firebase Example Project - Big Data
            </p>
          </div>
        </div>
        <div className="flex flex-1 place-items-center justify-end">
          {!isLogged ? (
            <button
              onClick={() => {
                loginModal.setVisible(true);
              }}
              className="bg-blue-500 text-white font-semibold text-xs p-2 rounded-xl px-3 shadow-2xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              LOGIN
            </button>
          ) : (
            <div className="flex justify-end gap-2 py-1 select-none">
              <p className="text-blue-500 text-md">{curUser?.email}</p>
              <button>
                <LogOutIcon
                  className="hover:text-red-500"
                  onClick={async () => {
                    await signOut(auth);
                    router.refresh();
                  }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
