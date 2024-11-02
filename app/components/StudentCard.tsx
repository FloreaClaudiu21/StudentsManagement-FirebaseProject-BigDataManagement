"use client";
import React, { useState } from "react";
import { Student } from "../types/Student";
import { collection, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { useCreateModal } from "../lib/states";

export default function StudentCard({
  studId,
  studData,
}: {
  studId: string;
  studData: Student;
}) {
  const router = useRouter();
  const loggedUser = auth.currentUser;
  const createModal = useCreateModal();
  const [loadingDel, setLoadingDel] = useState(false);
  const isOwner =
    (loggedUser && studData.createdBy == loggedUser?.email) ||
    (loggedUser && loggedUser.email == "floreaclaudiu128@gmail.com");
  const secondsMatchBDate = studData.birthDate.match(/seconds=(\d+)/);
  const nanosecondsMatchBDate = studData.birthDate.match(/nanoseconds=(\d+)/);
  const secondsMatchCDate = studData.createdAt.match(/seconds=(\d+)/);
  const nanosecondsMatchCDate = studData.createdAt.match(/nanoseconds=(\d+)/);
  const secondsBDate = secondsMatchBDate
    ? parseInt(secondsMatchBDate[1], 10)
    : 0;
  const nanosecondsBDate = nanosecondsMatchBDate
    ? parseInt(nanosecondsMatchBDate[1], 10)
    : 0;
  const bDate = new Timestamp(secondsBDate, nanosecondsBDate);
  const bDateFormat = new Date(
    bDate.seconds * 1000 + bDate.nanoseconds / 1000000
  ).toLocaleString();
  const secondsCDate = secondsMatchCDate
    ? parseInt(secondsMatchCDate[1], 10)
    : 0;
  const nanosecondsCDate = nanosecondsMatchCDate
    ? parseInt(nanosecondsMatchCDate[1], 10)
    : 0;
  const cDate = new Timestamp(secondsCDate, nanosecondsCDate);
  const cDateFormat = new Date(
    cDate.seconds * 1000 + cDate.nanoseconds / 1000000
  ).toLocaleString();
  const colStudents = collection(db, "students");
  const studDoc = doc(colStudents, studId);
  const onDeleteCard = async () => {
    if (!isOwner) return;
    setLoadingDel(true);
    await deleteDoc(studDoc);
    router.refresh();
  };
  const onEditCard = () => {
    if (!isOwner) return;
    const studentData = {
      ...studData,
    };
    studentData.id = studId;
    studentData.birthDate = new Date(
      bDate.seconds * 1000 + bDate.nanoseconds / 1000000
    );
    createModal.setVisible(true);
    createModal.setData(studentData);
    document.body.style.overflow = "hidden";
  };
  return (
    <div
      key={studId}
      className={`bg-white min-h-14 shadow-lg rounded-md relative flex flex-col ${
        loadingDel && " border border-dashed border-black bg-red-200"
      } `}
    >
      <div className="bg-blue-500 text-white px-2 flex flex-row gap-1">
        <p className="flex-1 break-all">Student #{studId}</p>
        <div className="flex flex-row gap-1 py-3">
          <button
            title={
              !isOwner
                ? "You are not allowed to edit this student!"
                : "Edit the student info"
            }
            disabled={loadingDel || !isOwner}
            className="px-1 text-md text-black bg-orange-400 rounded-md hover:bg-orange-500 font-bold disabled:bg-gray-400"
            onClick={() => onEditCard()}
          >
            ✎
          </button>
          <button
            title={
              !isOwner
                ? "You are not allowed to delete this student!"
                : "Delete the student"
            }
            disabled={loadingDel || !isOwner}
            className="px-2 text-md text-black bg-red-400 rounded-md hover:bg-red-500 font-bold disabled:bg-gray-400"
            onClick={() => onDeleteCard()}
          >
            🗑
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[2px] mb-2 p-2 flex-1">
        <p>
          • Name: {studData.firstName} {studData.lastName}
        </p>
        <p>• Email: {studData.email}</p>
        <p>
          • City & Country: {studData.city}, {studData.country}
        </p>
        <p>• Birth Date: {bDateFormat}</p>
        <p className="text-xs text-center">-=-=-=-=-=-=-=-=-=-=-=-</p>
        <p>• University Name: {studData.university}</p>
        <p>• Major: {studData.major}</p>
        <p>• Program: {studData.program}</p>
      </div>
      <div className="text-xs text-gray-500 text-right p-2 pt-0">
        Created by: {studData.createdBy} • {cDateFormat}
      </div>
    </div>
  );
}
