import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import DashboardClient from "./DashboardClient";
import { getProblemsWithToken } from "@/lib/api";

async function getProblemsOnServer(token) {
  if (!token) return [];

  const res = await getProblemsWithToken(token);
  if (!res) {
    return [];
  }
  return res;
}

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    user = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    redirect("/login");
  }

  const initialProblems = await getProblemsOnServer(token);

  return (
    <DashboardClient
      initialProblems={initialProblems}
      user={user}
      token={token}
    />
  );
}
