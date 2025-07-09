"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Edit, FileEdit, FileText, Loader2, Monitor, Save, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { useForm , Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./entry-form";
import { entriesToMarkdown } from "@/app/lib/helper";
import { useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import Image from "next/image";
import themes_banner from "@/public/themes-banner.jpg"
import SubscriptionPlans from "./subscription_plans/Subscriptions";
import ThemesButton from "./Themes_navigator/ThemesButton";






const ResumeBuilder = ({initialContent}) => {
    //Creating a state for the active tab
    const [activeTab , setActiveTab] = useState("edit");

    //Creating a state for the resumeMode
    const[resumeMode , setResumeMode] = useState("preview");

    //Creating a state to setup the markdown for the resume where one can edit and also render
    const[previewContent , setPreviewContent] = useState(initialContent);


    const {user} = useUser(); //Taking out the user from clerk

    //Creating a state until the PDF is being generated
    const [isGenerating , setIsGenerating] = useState(false);


    //Building the Form Tab using React Hook Form
    const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

   const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);


  //Watching the form values to update the markdown in real-time
  const formValues = watch();

    useEffect(() => {
        if(initialContent) setActiveTab("preview");
    } , [initialContent]);

    //If the tab changes, we update the markdown content with whatever is inside the form

    useEffect(() => {

        if(activeTab === "edit"){
            const newContent = getCombinedContent();
            setPreviewContent(newContent ? newContent : initialContent);
        }
    }, [formValues , activeTab])


    //------------Getting the contact markdown--------------------
    const getContactMarkdown = () => {
        const {contactInfo} = formValues;
        const parts = [];
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin)
        parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

        return parts.length > 0
        ? `## <div align="center">${user.fullName}</div>
            \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
        : "";
    }

    //----------------Creating a function to convert the form data to Markdown Format-----------

    const getCombinedContent = () => {

        //Taking the form values that will be rendered in the markdown content

        const {summary , skills , experience , education , projects} = formValues;

        return[
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
        ]
        .filter(Boolean)
        .join("\n\n")
    };


    //On submit function

      useEffect(() => {
        if (saveResult && !isSaving) {
        toast.success("Resume saved successfully!");
        }
        if (saveError) {
        toast.error(saveError.message || "Failed to save resume");
        }
    }, [saveResult, saveError, isSaving]);

    const onSubmit = async() => {
        try {

            await saveResumeFn(previewContent);
            
        } catch (error) {
            console.error("Save error")
        }
    };



    


    //Generate PDF Function

    const generatePDF = async () => {
  setIsGenerating(true);
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("resume-pdf");
    const opt = {
      margin: [15, 15],
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation error:", error);
  } finally {
    setIsGenerating(false);
  }
};





  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <h1 className="font-bold gradient-title text-4xl md:text-5xl">Resume Builder</h1>

            <div className="space-x-2">
                <Button variant="destructive" className="cursor-pointer"
                onClick = {onSubmit}
                disabled = {isSaving || activeTab === "themes"}>
                     {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                        ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save
                        </>
                )}
                </Button>

                <Button className="cursor-pointer" onClick={generatePDF} disabled={isGenerating || activeTab === "themes"}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating PDF ...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4" />
                            Download PDF
                        </>
                    )}

                </Button>
            </div>
      </div>

        {/* Creating the Tabs for Form and the Markdown resume and the pro feature*/}

        <Tabs value={activeTab} onValueChange = {setActiveTab} >
            <TabsList>
                <TabsTrigger value="edit">Form <FileText /> </TabsTrigger>
                <TabsTrigger value="preview">Markdown <FileEdit/> </TabsTrigger>
                <TabsTrigger value="themes">Themes <Sparkles/> </TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <form className="space-y-8">
                    <div className="space-y-4">

                        {/* Contact Information */}
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                {...register("contactInfo.email")}
                                type="email"
                                placeholder = "your@email.com"
                                error = {errors.contactInfo?.email} />

                                {errors.contactInfo?.email && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Number</label>
                                <Input
                                    {...register("contactInfo.mobile")}
                                    type="tel"
                                    placeholder="Enter your contact number"
                                />
                                {errors.contactInfo?.mobile && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.mobile.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">LinkedIn URL</label>
                                <Input
                                {...register("contactInfo.linkedin")}
                                    type="url"
                                    placeholder="https://linkedin.com/in/your-profile"
                                />
                                {errors.contactInfo?.linkedin && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.linkedin.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium"> Twitter/X Profile</label>
                                <Input
                                    {...register("contactInfo.twitter")}
                                    type="url"
                                    placeholder="https://twitter.com/your-handle"
                                />
                                {errors.contactInfo?.twitter && (
                                    <p className="text-sm text-red-500">
                                    {errors.contactInfo.twitter.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Professional Summary</h3>
                    <Controller
                        name="summary"
                        control={control}
                        render={({ field }) => (
                        <Textarea
                            {...field}
                            className="h-32"
                            placeholder="Write a compelling professional summary..."
                            error={errors.summary}
                        />
                        )}
                    />
                    {errors.summary && (
                        <p className="text-sm text-red-500">{errors.summary.message}</p>
                    )}
                </div>

                    {/* Skills */}

                    <div className="space-y-4">
                    <h3 className="text-lg font-medium">Skills</h3>
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                        <Textarea
                            {...field}
                            className="h-32"
                            placeholder="List down your key skills..."
                            error={errors.skills}
                        />
                        )}
                    />
                    {errors.skills && (
                        <p className="text-sm text-red-500">{errors.skills.message}</p>
                    )}
                </div>

                        {/* Experience */}

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Work Experience</h3>
                        <Controller
                            name="experience"
                            control={control}
                            render={({ field }) => (
                                <EntryForm
                                type="Experience"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.experience && (
                            <p className="text-sm text-red-500">{errors.experience.message}</p>
                        )}
                    </div>

                    {/* Education */}

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Education</h3>
                        <Controller
                            name="education"
                            control={control}
                            render={({ field }) => (
                                <EntryForm
                                type="Education"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                            
                            )}
                        />
                        {errors.education && (
                            <p className="text-sm text-red-500">{errors.education.message}</p>
                        )}
                    </div>


                    {/* Projects */}

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Projects</h3>
                        <Controller
                            name="projects"
                            control={control}
                            render={({ field }) => (

                                <EntryForm
                                type="Project"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                            
                            )}
                        />
                        {errors.projects && (
                            <p className="text-sm text-red-500">{errors.projects.message}</p>
                        )}
                    </div>

                </form>
            </TabsContent>
            <TabsContent value="preview">
                 {activeTab === "preview" && (
            <Button
              variant="outline"
              type="button"
              className="mb-2 cursor-pointer"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
                    {resumeMode === "preview" ? (
                        <>
                        <Edit className="h-4 w-4" />
                        Edit Resume
                        </>
                    ) : (
                        <>
                        <Monitor className="h-4 w-4" />
                        Show Preview
                        </>
                    )}
                    </Button>
                )}

                {activeTab === "preview" && resumeMode !== "preview" && (
                    <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">
                        You will lose editied markdown if you update the form data.
                    </span>
                    </div>
                )}

                <div className="border rounded-lg">
                    <MDEditor value={previewContent} onChange={setPreviewContent}
                    height={800}
                    preview={resumeMode}
                    data-color-mode="dark"
                    />
                </div>

                <div className="hidden">
                    <div id="resume-pdf">
                        <MDEditor.Markdown
                        source={previewContent}
                        style={{
                            backgroundColor: "white",
                            color : "black"
                        }} />

                    </div>

                </div>
            </TabsContent>

            <TabsContent value = "themes">

               <div className="mt-3">
                         <ThemesButton/>
               </div>

                <main className="max-w-7xl mx-auto w-full space-y-8 px-3 py-6 ">
                    

                    <div className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    {/* Content Section */}
                    <div className="order-2 lg:order-1 space-y-5">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                                Elevate your resume with - THEMES
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Upgrade to visually striking, professional resume templates with <b>SensAI – THEMES</b>. Whether it’s your first step or your next big leap, stand out with premium designs and effortless customization.

                            </p>
                        </div>

                        <hr/>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                What's possible with THEMES ? 
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Secured Resume Vault
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Designing and Customization
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Upgraded AI Features
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Hard Copy Generation
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                       Smart Page Break Detection for Seamless Printing
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                       Inbuilt Subscription Portal
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="inline-flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Smarter Resumes Start Here</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="relative">
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-3xl blur-3xl transform rotate-3"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-3xl blur-3xl transform -rotate-3"></div>
                            
                            {/* Image container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                                <Image
                                    src={themes_banner}
                                    alt="themes"
                                    width={400}
                                    height={400}
                                    className="w-full h-auto max-w-md mx-auto rounded-2xl"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        {/* Subscription Plans */}

        <div>
            <SubscriptionPlans />
        </div>
                


        </main>
            </TabsContent>
         </Tabs>


    </div>
  )
}

export default ResumeBuilder;
