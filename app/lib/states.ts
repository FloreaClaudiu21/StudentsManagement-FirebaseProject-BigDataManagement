/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Student } from "../types/Student";

type GlobalModal = {
  visible: boolean;
  setVisible: any;
  studentData?: Student | null;
  setData?: any;
};

export const useCreateModal = create<GlobalModal>((set) => ({
  visible: false,
  setVisible: (open: boolean) => set(() => ({ visible: open })),
  studentData: null,
  setData: (data: Student | null) => set(() => ({ studentData: data })),
}));
export const useLoginModal = create<GlobalModal>((set) => ({
  visible: false,
  setVisible: (open: boolean) => set(() => ({ visible: open })),
}));
