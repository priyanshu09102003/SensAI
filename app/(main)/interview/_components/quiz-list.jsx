"use client";

import { useRouter } from "next/navigation"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QuizResult from "./quiz_results";





const QuizList = ({assessments}) => {
    const router = useRouter();
    const [selectedQuiz , setSelectedQuiz] = useState(null);
  return (
    <>
      <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>

                    <CardTitle className="gradient-title text-3xl md:text-4xl">Recent Quizzes</CardTitle>
                    <CardDescription>Review your past quizzes in this section</CardDescription>
                </div>

                <Button onClick = {() => router.push("/interview/mock")} className="cursor-pointer">
                    Start New Quiz
                </Button>

            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {assessments.map((assessment , i) => {
                        return (
                            <Card className="cursor-pointer hover:bg-muted/70 transition-colors border-2"
                            key={assessment.id}
                            onClick = {() => setSelectedQuiz(assessment)}

                            >
                                <CardHeader>
                                    <CardTitle>Quiz {i + 1}</CardTitle>
                                    <CardDescription className="flex justify-between w-full">
                                        <div>Score: {assessment.quizScore.toFixed(1)}% </div>

                                        <div>
                                            {format(
                                                new Date(assessment.createdAt),
                                                "MMMM dd, yyyy HH:mm"
                                            )}
                                        </div>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-bold text-white
                                        ">Key takeaway: </span>
                                        {assessment.improvementTip}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

            </CardContent>
        </Card>

        {/* Quiz Dialog box */}

        <Dialog open={!!selectedQuiz} onOpenChange = {() => setSelectedQuiz(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <QuizResult
                    result={selectedQuiz}
                    onStartNew={() => router.push("/interview/mock")}
                    hideStartNew
                />
            </DialogContent>
        </Dialog>


    </>
  )
}

export default QuizList
