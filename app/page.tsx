

import AppSection from "./components/AppSection/AppSection";
import ElClubSection from "./components/ElClubSection/ElClubSection";
import FaqSection from "./components/Faq/FaqSection";
import HeroSection from "./components/home/HeroSection";
import HomeContactForm from "./components/home/HomeContactForm";
import HowItWorksSection from "./components/HowWorksSection/HowWorksSection";
import LocationSection from "./components/LocationSection/LocationSection";
import LotsSection from "./components/LotsSection/LotsSection";
import ZagariManifesto from "./components/Manifesto/ZagariManifesto";
import MembershipsSection from "./components/MebresiaSection/MembershipsSection";
import OwnerSection from "./components/OwnerSection/OwnerSection";
import PointsSection from "./components/PointSection/PointSection";
import ZagariExperience from "./components/ZagariExperience/ExperienceSection";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>

      <HeroSection />

      <ElClubSection />

      <ZagariExperience />

      <MembershipsSection /> 

      <PointsSection />
      
      <HowItWorksSection />

      <OwnerSection />

      <AppSection />

      {/* <CinematicExperience /> */}

      {/* <LotsSection/> */}

      {/* <AmenitiesSection /> */}

      {/* <HomeHero /> */}

      {/* <NearbyExperiences /> */}

      {/* <CabinsSection /> */}

      <LocationSection />

      <FaqSection />

      <ZagariManifesto />

      <HomeContactForm />

      {/* <FinalCta /> */}
    </main>
  );
}