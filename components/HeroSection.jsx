"use client";

import { CalendarClock, Rocket } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"
import { SignedIn } from '@clerk/nextjs'
import { useEffect, useRef } from "react"


const HeroSection = () => {

  const imageRef =  useRef(null);
   useEffect(() => {
  const imageElement = imageRef.current;

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const scrollThreshold = 100;

    if (scrollPosition > scrollThreshold) {
      imageElement?.classList.add("scrolled");
    } else {
      imageElement?.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
        <div className="space-y-6 text-center">
            <div className="space-y-6 mx-auto">
                <h1 className=" text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl gradient-title">
                    Empowering Your Career Journey
                    <br />
                    with AI Precision
                </h1>
              <p className="mx-auto max-w-[600px] px-4 text-sm text-muted-foreground md:text-xl md:px-0">
                Unlock career breakthroughs with AI-optimized resumes, magnetic cover letters, and personalized interview prep—engineered for success.
                </p>

            </div>

            <SignedIn>
                <div className="flex justify-center space-x-4">
                    <a href="https://sensai-mock-interviews.vercel.app/" target="_blank">
                        <Button size="lg" className="cursor-pointer px-8">
                        Interview Simulator <Rocket /> 
                        </Button>
                    </a>
                    <a href="https://sensaischeduler.vercel.app/" target="_blank">
                        <Button size="lg" className="cursor-pointer px-8" variant="secondary">
                        Schedule Meetings <CalendarClock /> 
                        </Button>
                    </a>
                    
                </div>
            </SignedIn>

            <div className="hero-image-wrapper mt-5 md:mt-0">
                <div ref={imageRef} className="hero-image">
                    <Image src={"/banner.jpeg"} width={1280} height={720} alt="Banner Image" className="rounded-lg shadow-2xl border mx-auto" priority />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
