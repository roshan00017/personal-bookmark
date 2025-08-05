import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LandingHero from "./components/LandingHero";

export default async function HomePage() {
  const user = await getCurrentUser();
  return <LandingHero isLoggedIn={!!user} />;
}
