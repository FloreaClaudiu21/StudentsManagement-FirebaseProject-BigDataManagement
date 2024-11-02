"use client";

import React, { useRef, useState } from "react";
import { useLoginModal } from "../lib/states";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginOrRegisterModal() {
  const router = useRouter();
  const loginModal = useLoginModal();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassLogin, setShowPassLogin] = useState(false);
  const [showPassReg, setShowPassReg] = useState(false);
  const [showRePassReg, setShowRePassReg] = useState(false);
  const emailLoginRef = useRef<HTMLInputElement | null>(null);
  const passLoginRef = useRef<HTMLInputElement | null>(null);
  const emailRegisterRef = useRef<HTMLInputElement | null>(null);
  const passRegisterRef = useRef<HTMLInputElement | null>(null);
  const repassRegisterRef = useRef<HTMLInputElement | null>(null);
  const refs = [
    emailLoginRef,
    passLoginRef,
    emailRegisterRef,
    passRegisterRef,
    repassRegisterRef,
  ];
  const resetAllInputs = () => {
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
  };
  const empty = (ref: React.MutableRefObject<HTMLInputElement | null>) => {
    return !(ref.current && ref.current.value.trim() !== "");
  };
  function checkPassword(password: string) {
    const minLength = 5;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (password.length < minLength) {
      return {
        ok: false,
        msg: "Password must be at least 5 characters long.",
      };
    }
    if (!hasUpperCase) {
      return {
        ok: false,
        msg: "Password must include at least one uppercase letter.",
      };
    }
    if (!hasLowerCase) {
      return {
        ok: false,
        msg: "Password must include at least one lowercase letter.",
      };
    }
    if (!hasNumber) {
      return {
        ok: false,
        msg: "Password must include at least one number.",
      };
    }
    if (!hasSpecialChar) {
      return {
        ok: false,
        msg: "Password must include at least one special character.",
      };
    }
    return { ok: true, msg: "Password is valid." };
  }
  const matchPasswords = () => {
    const passReg = passRegisterRef.current?.value;
    const repassReg = repassRegisterRef.current?.value;
    if (!passReg || !repassReg) {
      return false;
    }
    if (passReg == repassReg) {
      return true;
    }
    return false;
  };
  const onCloseModal = () => {
    setMode("login");
    loginModal.setVisible(false);
    document.body.style.overflow = "";
    resetAllInputs();
  };
  const onSaveCredentials = async () => {
    try {
      if (mode == "login") {
        const passLoginCheck = checkPassword(passLoginRef.current?.value ?? "");
        if (empty(emailLoginRef) || empty(passLoginRef)) {
          alert("Please complete all the required fields in order to login.");
          return;
        }
        if (!passLoginCheck.ok) {
          alert(passLoginCheck.msg);
          return;
        }
        setLoading(true);
        await signInWithEmailAndPassword(
          auth,
          emailLoginRef.current?.value ?? "",
          passLoginRef.current?.value ?? ""
        );
        onCloseModal();
        setLoading(false);
        router.refresh();
        return;
      } else {
        const passRegisterCheck = checkPassword(
          passRegisterRef.current?.value ?? ""
        );
        const repassRegisterCheck = checkPassword(
          repassRegisterRef.current?.value ?? ""
        );
        if (
          empty(emailRegisterRef) ||
          empty(passRegisterRef) ||
          empty(repassRegisterRef)
        ) {
          alert(
            "Please complete all the required fields in order to complete the registration."
          );
          return;
        }
        if (!matchPasswords()) {
          alert("Passwords must match!");
          return;
        }
        if (!passRegisterCheck.ok) {
          alert(passRegisterCheck.msg);
          return;
        }
        if (!repassRegisterCheck.ok) {
          alert(repassRegisterCheck.msg);
          return;
        }
        setLoading(true);
        await createUserWithEmailAndPassword(
          auth,
          emailRegisterRef.current?.value ?? "",
          passRegisterRef.current?.value ?? ""
        );
        setMode("login");
        resetAllInputs();
        setLoading(false);
        alert("Account registered!");
        return;
      }
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        loginModal.visible
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
          loginModal.visible
            ? "opacity-100 translate-y-0 flex"
            : "opacity-0 -translate-y-10 pointer-events-none flex"
        } w-[45%] p-4 pb-0 bg-white overflow-y-auto mx-auto flex flex-col max-w-[600px] rounded-lg shadow-md relative transition-all duration-300 ease-in-out ${
          mode == "login"
            ? " h-[55vh] min-h-[450px] "
            : " h-[65vh] min-h-[550px]"
        }`}
      >
        <div className="border-b-2 border-b-blue-500 p-4 pt-0 px-0">
          <p className="text-xl text-blue-500 font-bold">
            {mode == "login"
              ? `Sign In with your account`
              : "Register your account"}
          </p>
        </div>
        <div className="flex flex-col flex-1 gap-4 overflow-y-auto pr-2 my-1 mb-4">
          {mode == "login" ? (
            <>
              <div className="flex gap-1 flex-col mt-3">
                <p className="text-md font-bold">Email*:</p>
                <input
                  ref={emailLoginRef}
                  type="email"
                  placeholder="student@rau.ro"
                  className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
                />
              </div>
              <div className="flex gap-1 flex-col">
                <p className="text-md font-bold">Password*:</p>
                <div className="flex flex-row gap-2 place-items-center">
                  <input
                    ref={passLoginRef}
                    placeholder="********"
                    type={showPassLogin ? "text" : "password"}
                    className="border-2 px-2 flex-1 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
                  />
                  {!showPassLogin ? (
                    <EyeIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowPassLogin(true);
                      }}
                    />
                  ) : (
                    <EyeOffIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowPassLogin(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-1 flex-col mt-3">
                <p className="text-md font-bold">Email*:</p>
                <input
                  type="email"
                  ref={emailRegisterRef}
                  placeholder="student@rau.ro"
                  className="border-2 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
                />
              </div>
              <div className="flex gap-1 flex-col">
                <p className="text-md font-bold">Password*:</p>
                <div className="flex flex-row gap-2 place-items-center">
                  <input
                    ref={passRegisterRef}
                    placeholder="********"
                    type={showPassReg ? "text" : "password"}
                    className="border-2 px-2 flex-1 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
                  />
                  {!showPassReg ? (
                    <EyeIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowPassReg(true);
                      }}
                    />
                  ) : (
                    <EyeOffIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowPassReg(false);
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-col">
                <p className="text-md font-bold">Re-Password*:</p>
                <div className="flex flex-row gap-2 place-items-center">
                  <input
                    ref={repassRegisterRef}
                    placeholder="********"
                    type={showRePassReg ? "text" : "password"}
                    className="border-2 flex-1 px-2 border-blue-500 rounded-lg p-1 bg-gray-100 outline-none focus:bg-gray-200 focus:border-black"
                  />
                  {!showRePassReg ? (
                    <EyeIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowRePassReg(true);
                      }}
                    />
                  ) : (
                    <EyeOffIcon
                      size={28}
                      className="hover:cursor-pointer"
                      onClick={() => {
                        setShowRePassReg(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="my-1">
          <p
            onClick={() => {
              setMode(mode == "login" ? "register" : "login");
            }}
            className="text-black text-sm text-right hover:underline hover:cursor-pointer hover:text-blue-500"
          >
            {mode == "login"
              ? "You don't have an account? Register now!"
              : "You already have an account? Login here!"}
          </p>
        </div>
        <div className="bg-white h-20 border-t-blue-500 border flex place-items-center justify-end gap-3">
          <button
            onClick={onCloseModal}
            className="bg-red-500 hover:bg-red-700 p-2 pt-1 text-white font-bold shadow-lg px-3 rounded-lg"
          >
            X CANCEL
          </button>
          <button
            onClick={onSaveCredentials}
            className="bg-green-500 hover:bg-green-700 p-2 pt-1 text-white font-bold shadow-lg px-3 rounded-lg"
          >
            {mode == "login" ? "LOGIN" : "REGISTER"}
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
