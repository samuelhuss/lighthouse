import { campService } from "@/modules/camp/camp.service";
import { LandingPage } from "@/components/landing/LandingPage";

export const revalidate = 300;

export default async function Home() {
  const camp = await campService.getPublicInfo().catch(() => null);
  return <LandingPage camp={camp} />;
};