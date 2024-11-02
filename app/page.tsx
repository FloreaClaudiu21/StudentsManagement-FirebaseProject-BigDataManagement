import FloatingAddButton from "@/app/components/FloatingAddButton";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "./lib/firebase";
import CreateOrUpdateModal from "./components/CreateOrUpdateModal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginOrRegisterModal from "./components/LoginOrRegisterModal";
import StudentsList from "./components/StudentsList";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { search } = await searchParams;
  let data = query(collection(db, "students"), orderBy("createdAt", "desc"));
  if (search && search != "" && search.length >= 1) {
    data = query(
      collection(db, "students"),
      where("email", ">=", search.toLowerCase()),
      where("email", "<", search.toLowerCase() + "\uf8ff"),
      orderBy("createdAt", "desc")
    );
  }
  const studList = await getDocs(data);
  const docsFound = studList.docs.length > 0;
  return (
    <div className="flex flex-col min-h-screen bg-[#eeee]">
      <Navbar />
      <StudentsList search={search} docsFound={docsFound} studList={studList} />
      <Footer />
      <FloatingAddButton />
      <CreateOrUpdateModal />
      <LoginOrRegisterModal />
    </div>
  );
}
