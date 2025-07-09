import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" ;
import { BrainCircuit, History, Trophy } from "lucide-react";

const StatsCards = ({assessments}) => {

        //Getting the average score of the user in the dashboard
            const getAverageScore = () => {
            if (!assessments?.length) return 0;
            const total = assessments.reduce(
            (sum, assessment) => sum + assessment.quizScore,
            0
            );
            return (total / assessments.length).toFixed(1);
        };

        //Getting the most recent/latest assessment of the user in the dashboard
        
        const getLatestAssessment = () => {
            if (!assessments?.length) return null;

            return [...assessments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            };

        //Getting the total questions practiced by the user

        const getTotalQuestions = () => {
            if(!assessments?.length) return 0;

            return assessments.reduce(
                (sum , assessments) => sum + assessments.questions.length,
                0
            );
        };

  return (
    <div className='grid gap-4 md:grid-cols-3'>

        {/* Average Scores card */}

         <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">Average Score</CardTitle>
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-2xl font-bold">{getAverageScore()}%</div>
        
                    <p className="text-xs text-muted-foreground"> Across all assessments</p>
                </CardContent>
            </Card>
        
        {/* Displaying the total questions practiced till now */}
            <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">Questions Practiced</CardTitle>
                    <BrainCircuit className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-2xl font-bold">{getTotalQuestions()}</div>
        
                    <p className="text-xs text-muted-foreground"> Overall Practice Count</p>
                </CardContent>
            </Card>

        {/* Displaying the latest score of the last attempted quiz */}

          <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">Latest Score</CardTitle>
                    <History className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-2xl font-bold">{getLatestAssessment() ?.quizScore.toFixed(1) || 0}%</div>
        
                    <p className="text-xs text-muted-foreground">Most recent quiz</p>
                </CardContent>
            </Card>
      
    </div>
  )
};

export default StatsCards

