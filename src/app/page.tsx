import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LandingHero from "./components/LandingHero";


export default async function HomePage() {
  const user = getCurrentUser(); // server-side
  return <LandingHero isLoggedIn={!!user} />;
}
