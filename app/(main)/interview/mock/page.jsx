import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Quiz from "../_components/quiz";

const MockInterview = () => {
  return (
    <div className="container mx-auto space-y-4 py-6">
      
      <div className="flex flex-col space-y-2 mx-2">
        <Link href={'/interview'}>
        <Button variant="link" className="cursor-pointer gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation Lab
        </Button>
        
        </Link>

        <div>
          <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
          <p className="text-muted-foreground">
            Enhance your expertise and stay ahead with industry-specific AI-generated interview questions tailored to your field.
          </p>
        </div>
      </div>

      <Quiz />


    </div>
  )
}

export default MockInterview;
