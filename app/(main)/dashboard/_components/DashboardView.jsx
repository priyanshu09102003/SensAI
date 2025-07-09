"use client";
import { TrendingUp , TrendingDown, LineChart ,BriefcaseIcon , BrainCircuit, Info, Sparkles , Loader2 } from "lucide-react";
import {format, formatDistanceToNow} from "date-fns";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" ;
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import AskSensXButton from "@/components/AskSensX";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";





function DashboardView({insights}) {

  const router = useRouter();

    //getting the salary data to be rendered in the recharts
    const salaryData = insights.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min/1000,
        max : range.max/1000,
        median : range.median/1000,
    }));

    //Fetching the demand Level
    const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

    //Getting the market outlook
   const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdateDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    {addSuffix : true}
  );

  
  //Generating roadmap using the Generate ROADMAP component

    const [skill, setSkill] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState('');

     const generateRoadmap = async () => {
    if (!skill.trim()) {
      setError('Please enter a skill to generate roadmap');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Navigate to roadmap page with skill as query parameter
      await router.push(`/roadmap?skill=${encodeURIComponent(skill)}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Failed to navigate. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSkill('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      generateRoadmap();
    }
  };


  
  



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <Badge variant="outline">Last updated : {lastUpdateDate}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">Market Outlook</CardTitle>
                    <OutlookIcon className={`h-6 w-6 ${outlookColor}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{insights.marketOutlook}</div>

                    <p className="text-xs text-muted-foreground"> Next update {nextUpdateDistance}</p>
                </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">Industry Growth</CardTitle>
                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                      <div className="text-2xl font-bold">
                                    {insights.growthRate.toFixed(1)}%
                        </div>
                        <Progress value={insights.growthRate} className="mt-2" />


                </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">Demand Level</CardTitle>
                    <BriefcaseIcon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{insights.demandLevel}</div>

                     <div
                            className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                                insights.demandLevel
                            )}`}
                            />
                </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold">Top Skills</CardTitle>
                    <BrainCircuit className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-1">
                                {insights.topSkills.map((skill) => (
                                    <Badge key={skill} variant="destructive">
                                    {skill}
                                    </Badge>
                                ))}
                    </div>
                </CardContent>
            </Card>

      </div>

       <Card >
                <CardHeader>
                    <CardTitle>Salary Ranges by Roles</CardTitle>
                    <CardDescription>Displaying the Minimum , Median and Maximum salaries(in thousands) of the top roles in your selected industry.</CardDescription>
            
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%" >
                                <BarChart
                                data={salaryData}
                                >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={({active, payload , label})=>{
                                    if (active && payload && payload.length){
                                        return (
                                                <div className="bg-background border rounded-lg p-2 shadow-md">
                                                <p className="font-medium">{label}</p>
                                                {payload.map((item) => (
                                                    <p key={item.name} className="text-sm">
                                                    {item.name}: ${item.value}K
                                                    </p>
                                                ))}
                                                </div>
                                            );
                                    }
                                    return null;
                                }}/>
                                <Bar dataKey="min" fill="#10b981" name="Min Salary (K)" />
                                <Bar dataKey="median" fill="#3b82f6" name="Median Salary (K)" />
                                <Bar dataKey="max" fill="#f97316" name="Max Salary (K)" />
                                </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
        </Card>
                                
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping your industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>In-Demand Skills to Maintain Industry Relevance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-5">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="destructive">
                  {skill}
                </Badge>
              ))}
            </div>

            <Separator className="bg-muted-foreground h-[2px] opacity-80" />

            <div className="mt-4 space-y-4" suppressHydrationWarning>
                <AskSensXButton />
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5" />
                    <span>
                        <b>SensX</b> is your built-in AI model — ask anything about skills, trends, or roadmaps, and get smart, tailored answers instantly.
                    </span>
                </p>
            </div>

            <div className="mt-4 space-y-3">

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full cursor-pointer px-3 py-1.5" variant="premium">
                      Generate Roadmap <Sparkles />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter your Target skill</DialogTitle>
                    <DialogDescription asChild>
                      <div className="mt-2.5">
                        <Input placeholder='Eg. Digital Marketing, Coding ...'
                        value = {skill}
                        onChange={(e) => setSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        />
                        {error && (
                          <p className="text-sm text-red-500 mt-2">{error}</p>
                        )}
                      </div>
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button className="cursor-pointer font-semibold"
                    onClick={generateRoadmap}
                    disabled={isLoading || !skill.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate <Sparkles />
                        </>
                      )}
                      </Button>
                    <Button variant="destructive" className="cursor-pointer"
                    onClick={handleCancel}
                    disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <p className="text-xs text-muted-foreground flex items-start gap-2 ">
                <Info className="w-4 h-4 " />
                    <span>
                        <b>Wish to learn a skill? </b> Generate a roadmap for any skill you aim to master and record it for reference.
                    </span>
                </p>
              

            </div>
          </CardContent>
        </Card>
      </div>
    

    </div>
  )
}

export default DashboardView
