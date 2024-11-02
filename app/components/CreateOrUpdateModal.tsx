"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCreateModal } from "../lib/states";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Student } from "../types/Student";
import { useRouter } from "next/navigation";

export default function CreateOrUpdateModal() {
  const router = useRouter();
  const createModal = useCreateModal();
  const loggedUser = auth.currentUser;
  const colStud = collection(db, "students");
  const [loading, setLoading] = useState(false);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const birthDateRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const universityRef = useRef<HTMLInputElement | null>(null);
  const majorRef = useRef<HTMLInputElement | null>(null);
  const programRef = useRef<HTMLInputElement | null>(null);
  /////////////////////////////////////////////////////////
  const refs = [
    firstNameRef,
    lastNameRef,
    emailRef,
    birthDateRef,
    cityRef,
    countryRef,
    universityRef,
    majorRef,
    programRef,
  ];
  const resetAllInputs = () => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
  };
  const onSaveStudent = async () => {
    const allFieldsCompleted = refs.every(
      (ref) => ref.current && ref.current.value.trim() !== ""
    );
    if (!allFieldsCompleted) {
      alert("Please complete all fields before saving.");
      return;
    }
    setLoading(true);
    const birthDate = birthDateRef.current?.value;
    const birthDateObject = birthDate ? new Date(birthDate) : null;
    const studentData = {
      firstName: firstNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      email: emailRef.current?.value,
      birthDate: birthDateObject,
      city: cityRef.current?.value,
      country: countryRef.current?.value,
      university: universityRef.current?.value,
      major: majorRef.current?.value,
      program: programRef.current?.value,
    } as Student;
    if (createModal.studentData != null) {
      const studDoc = doc(colStud, createModal.studentData.id);
      await updateDoc(studDoc, studentData);
    } else {
      await addDoc(colStud, {
        ...studentData,
        createdAt: new Date(),
        createdBy: loggedUser?.email,
      });
    }
    router.refresh();
    onCloseModal();
    setLoading(false);
    return;
  };
  const onCloseModal = () => {
    createModal.setVisible(false);
    document.body.style.overflow = "";
    resetAllInputs();
  };
  useEffect(() => {
    if (createModal.studentData) {
      const {
        firstName,
        lastName,
        email,
        birthDate,
        city,
        country,
        university,
        major,
        program,
      } = createModal.studentData;
      if (firstNameRef.current) firstNameRef.current.value = firstName || "";
      if (lastNameRef.current) lastNameRef.current.value = lastName || "";
      if (emailRef.current) emailRef.current.value = email || "";
      if (birthDateRef.current)
        birthDateRef.current.value =
          birthDate.toLocaleDateString("en-CA") || "";
      if (cityRef.current) cityRef.current.value = city || "";
      if (countryRef.current) countryRef.current.value = country || "";
      if (universityRef.current) universityRef.current.value = university || "";
      if (majorRef.current) majorRef.current.value = major || "";
      if (programRef.current) programRef.current.value = program || "";
    }
  }, [createModal.studentData]);
  return (
    <div
      className={`${
        createModal.visible
          ? "opacity-100 flex"
          : "opacity-0 pointer-events-none flex"
      } fixed top-0 min-h-screen w-full bg-[rgba(0,0,0,0.65)] z-[999] transition-all duration-300 ease-in-out place-items-center`}
    >
      {loading && (
        <div className="w-full h-full text-white font-serif font-bold text-center text-2xl fixed flex place-items-center justify-center top-1/2 left-1/2 z-[80] bg-[rgba(0,0,0,0.6)] -translate-x-1/2 -translate-y-1/2">
          Saving... Please wait!
        </div>
      )}
      <div
        className={`${
          createModal.visible
            ? "opacity-100 translate-y-0 flex"
            : "opacity-0 -translate-y-10 pointer-events-none flex"
        } w-[90%] h-[90vh] p-4 pb-0 bg-white overflow-y-auto mx-auto flex flex-col max-w-[864px] rounded-lg shadow-md relative transition-all duration-300 ease-in-out`}
      >
        <div className="border-b-2 border-b-blue-500 p-4 pt-0 px-0">
          <p className="text-xl text-blue-500 font-bold">
            {createModal.studentData != null
              ? `Update the student with ID "${createModal.studentData.id}"`
              : "Add a new student"}
          </p>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 my-1 mb-4">
          <div className="flex gap-1 flex-col mt-3">
            <p className="text-md font-bold">First Name*:</p>
            <input
              ref={firstNameRef}
              defaultValue={createModal.studentData?.firstName}
              placeholder="Popescu"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Last Name*:</p>
            <input
              ref={lastNameRef}
              placeholder="Ion"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Email*:</p>
            <input
              ref={emailRef}
              placeholder="student@rau.ro"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Birth Date*:</p>
            <input
              type="date"
              ref={birthDateRef}
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">City*:</p>
            <input
              ref={cityRef}
              placeholder="Bucharest"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Country*:</p>
            <input
              ref={countryRef}
              placeholder="Romania"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">University*:</p>
            <input
              ref={universityRef}
              placeholder="Romanian American University"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Major*:</p>
            <input
              ref={majorRef}
              placeholder="Computer Science"
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
          <div className="flex gap-1 flex-col">
            <p className="text-md font-bold">Program*:</p>
            <input
              placeholder="Master"
              ref={programRef}
              className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
            />
          </div>
        </div>
        <div className="bg-white h-20 border-t-blue-500 border flex place-items-center justify-end gap-3">
          <button
            onClick={onCloseModal}
            className="bg-red-500 hover:bg-red-700 p-2 pt-1 text-white font-bold shadow-lg px-3 rounded-lg"
          >
            X CANCEL
          </button>
          <button
            onClick={onSaveStudent}
            className="bg-green-500 hover:bg-green-700 p-2 pt-1 text-white font-bold shadow-lg px-3 rounded-lg"
          >
            💾 {createModal.studentData != null ? "UPDATE" : "SAVE"}
          </button>
        </div>
        <button
          onClick={onCloseModal}
          className="absolute right-4 top-3 text-md border border-black p-1 px-3 rounded-full hover:bg-gray-400 hover:text-white shadow-2xl"
        >
          ✗
        </button>
      </div>
    </div>
  );
}
