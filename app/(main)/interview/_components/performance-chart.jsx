"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from 'recharts';






const PerformanceChart = ({assessments}) => {
    const [chartData , setChartData] = useState([]);

    useEffect(() => {
        if(assessments){
            const formattedData = assessments.map((assessment) => ({
                date: format(new Date(assessment.createdAt), "MMM dd"),
                score: parseFloat(assessment.quizScore.toFixed(1)),
            }));

            setChartData(formattedData);
        }

    } , [assessments])


  return (
      <Card>
            <CardHeader>
                <CardTitle className="gradient-title text-3xl md:text-4xl">Performance Trend</CardTitle>

                <CardDescription>Analyze your performance trends across past quizzes</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                        content={({ active, payload }) => {
                        if (active && payload?.length) {
                            return (
                            <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="text-sm font-medium">
                                Score: {payload[0].value}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                {payload[0].payload.date}
                                </p>
                            </div>
                            );
                        }
                        return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#facc15"
                        strokeWidth={2}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

  )
}

export default PerformanceChart
