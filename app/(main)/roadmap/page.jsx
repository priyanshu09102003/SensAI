"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  ConnectionLineType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { roadmapGenerator } from '@/actions/roadmapGenerator';
import CustomRoadmapNode from '@/components/CustomRoadmapNode';

// Node types for ReactFlow
const nodeTypes = {
  turbo: CustomRoadmapNode,
};

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skill = searchParams.get('skill');
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (skill) {
      generateRoadmapData();
    }
  }, [skill]);

  const generateRoadmapData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await roadmapGenerator(skill);
      setRoadmapData(result);
      setNodes(result.initialNodes);
      setEdges(result.initialEdges);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStepCompletion = (nodeId) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Generating your roadmap...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">Error: {error}</p>
          <Button onClick={generateRoadmapData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="px-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleGoBack} variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold gradient-title">
            {roadmapData?.roadmapTitle || 'Your Generated Roadmap'}
          </h1>
        </div>
        
        {roadmapData && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 mb-2">{roadmapData.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Estimated Duration: {roadmapData.duration}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side - Roadmap Info */}
          <div className="lg:col-span-1">
            <Card className="h-fit max-h-[600px]">
              <CardHeader>
                <CardTitle className="text-lg">Learning Steps</CardTitle>
                <CardDescription>Track your progress through the roadmap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto max-h-[500px]">
                {roadmapData?.initialNodes?.map((node) => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      completedSteps.has(node.id) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => toggleStepCompletion(node.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">{node.data.title}</h4>
                        <p className="text-xs text-black mt-1">{node.data.description}</p>
                      </div>
                      {completedSteps.has(node.id) && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - React Flow Diagram */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Visual Roadmap</CardTitle>
                <CardDescription>Interactive learning flow diagram</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    fitViewOptions={{ padding: 50 }}
                    className="bg-gray-50"
                  >
                    <Background color="#f1f5f9" />
                    <Controls />
                    <MiniMap />
                  </ReactFlow>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;