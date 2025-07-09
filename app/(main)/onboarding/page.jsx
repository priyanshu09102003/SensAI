import { industries } from "@/data/industries";
import OnboardingForm from "./_components/OnboardingForm";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";


const OnboardingPage = async () => {
    //checking if the user is already onboarded

    const {isOnboarded}  =  await getUserOnboardingStatus();

    if(isOnboarded){
        redirect("/dashboard");
    }


  return (
    <main>
        <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage;

