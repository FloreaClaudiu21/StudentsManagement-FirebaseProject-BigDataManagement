"use client";
import { auth } from "@/app/lib/firebase";
import React from "react";
import { useCreateModal } from "../lib/states";

export default function FloatingAddButton() {
  const logged = auth.currentUser != null;
  const createModal = useCreateModal();
  const onAddCard = async () => {
    createModal.setVisible(true);
    document.body.style.overflow = "hidden";
  };
  return (
    <button
      disabled={!logged}
      onClick={() => onAddCard()}
      title={
        logged
          ? "Add a new student in the database..."
          : "You must be logged in order to add students!"
      }
      className="flex justify-center place-items-center fixed right-4 bottom-4 bg-green-500 h-10 w-10 rounded-full text-white font-bold text-xl text-center shadow-md hover:cursor-pointer hover:bg-green-700 disabled:bg-gray-500"
    >
      <span>+</span>
    </button>
  );
}
