"use client"

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Zap, CheckCircle, AlertCircle, TrendingUp, Target, Lightbulb, Star, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Professional Toast component
const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${
      type === 'success' 
        ? 'bg-gray-800/95 border-l-4 border-green-500' 
        : 'bg-gray-800/95 border-l-4 border-red-500'
    } backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700/50 max-w-xs sm:max-w-sm`}>
      <div className="flex items-center space-x-3">
        {type === 'success' ? (
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        <span className="text-sm text-gray-200 leading-tight">{message}</span>
        <button 
          onClick={onClose}
          className="ml-auto hover:bg-gray-700/50 rounded-full p-1 transition-colors opacity-70 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const page = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Reset previous errors
      setError('');
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only.');
        showToast('PDF files only', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        showToast('File too large', 'error');
        return;
      }
      
      setResumeFile(file);
      // Remove the upload success toast - only show analysis success
      console.log('✅ File uploaded:', file.name, file.size);
    }
  };

  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      showToast('Job description required', 'error');
      return;
    }
    
    if (!resumeFile) {
      setError('Please upload a resume file.');
      showToast('Resume file required', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    setUploadProgress(0);
    
    try {
      console.log('🚀 Starting analysis...');
      
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const response = await fetch(`${window.location.origin}/api/analyze-resume`, {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const analysisResult = await response.json();
      console.log('✅ Analysis received:', analysisResult);
      
      // Validate the response structure
      if (!analysisResult.matchScore && analysisResult.matchScore !== 0) {
        throw new Error('Invalid analysis response format');
      }
      
      setAnalysis(analysisResult);
      setError('');
      
      // Show professional success toast
      showToast('Analysis complete', 'success');
      
    } catch (error) {
      console.error('❌ Error analyzing resume:', error);
      const errorMessage = error.message || 'Analysis failed';
      setError(errorMessage);
      showToast('Analysis failed', 'error');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
    
  return (
    <div className="space-y-15">
      {/* Header */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <h1 className="font-bold gradient-title text-2xl md:text-5xl">Applicant Tracking System</h1>
        </div>
        <p className="text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          Smart resume insights, instantly
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Job Description</span>
            </CardTitle>
            <CardDescription>
              Paste the job description you want to match against
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Fixed height container with scrollbar */}
            <div className="relative">
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] max-h-[300px] bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4B5563 #1F2937'
                }}
              />
              {/* Custom scrollbar styles for webkit browsers */}
              <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                  width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                  background: #1F2937;
                  border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                  background: #4B5563;
                  border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                  background: #6B7280;
                }
              `}</style>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Characters: {jobDescription.length}
              </div>
              {jobDescription.length > 1000 && (
                <div className="text-xs text-yellow-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Long description - scroll to view all</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-green-400" />
              <span>Upload Resume</span>
            </CardTitle>
            <CardDescription>
              Upload your resume in PDF format (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {resumeFile ? (
                      <>
                        <span className="text-green-400">✓ {resumeFile.name}</span>
                        <br />
                        <span className="text-xs">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      'Click to upload PDF resume'
                    )}
                  </p>
                </label>
              </div>
              
              {/* Progress Bar */}
              {isAnalyzing && uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="text-sm text-gray-400 text-center">
                    {uploadProgress < 90 ? 'Uploading...' : 'Analyzing...'}
                  </div>
                </div>
              )}
              
              <Button
                onClick={analyzeResume}
                disabled={!jobDescription.trim() || !resumeFile || isAnalyzing}
                className="w-full cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis section */}
      {analysis && (
        <div className="space-y-6">
          {/* Match Score */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span>Match Score</span>
                </div>
                <Badge variant={analysis.matchScore >= 80 ? "default" : analysis.matchScore >= 60 ? "secondary" : "destructive"}>
                  {analysis.overallRating}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                    {analysis.matchScore}%
                  </div>
                  <p className="text-gray-400 mt-2">Overall Match Score</p>
                </div>
                <Progress 
                  value={analysis.matchScore} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Poor Match</span>
                  <span>Excellent Match</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="recommendations">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths?.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      )) || <li className="text-gray-400">No strengths data available</li>}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-400">
                      <AlertCircle className="w-5 h-5" />
                      <span>Areas for Improvement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.weaknesses?.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{weakness}</span>
                        </li>
                      )) || <li className="text-gray-400">No weaknesses data available</li>}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-green-400">Matched Keywords</CardTitle>
                    <CardDescription>
                      {analysis.keywordMatch?.matched?.length || 0} of {analysis.keywordMatch?.total || 0} keywords found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordMatch?.matched?.map((keyword, index) => (
                        <Badge key={index} variant="default" className="bg-green-600 hover:bg-green-700">
                          {keyword}
                        </Badge>
                      )) || <span className="text-gray-400">No matched keywords</span>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-red-400">Missing Keywords</CardTitle>
                    <CardDescription>
                      Consider adding these keywords to improve your match score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords?.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="bg-red-600 hover:bg-red-700">
                          {keyword}
                        </Badge>
                      )) || <span className="text-gray-400">No missing keywords identified</span>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              <div className="grid gap-4">
                {analysis.sections && Object.entries(analysis.sections).map(([section, data]) => (
                  <Card key={section} className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold capitalize">{section}</h3>
                        <span className={`font-bold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                      <Progress value={data.score} className="mb-2" />
                      <p className="text-sm text-gray-400">{data.feedback}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-400">
                    <Lightbulb className="w-5 h-5" />
                    <span>Improvement Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations?.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-300">{recommendation}</p>
                      </div>
                    )) || <p className="text-gray-400">No recommendations available</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Toast Component */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}

export default page