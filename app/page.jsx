import HeroSection from "@/components/HeroSection";
import { features  } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Search, Sparkles , Settings , ArrowRight  } from "lucide-react";
import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";





export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>

      <HeroSection />

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 flex justify-center items-center gap-2 relative text-white">
              Explore What’s Inside
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature , index) =>{

            return(
              <Card key={index} className="border-2 hover:border-primary transition-colors duration-300 cursor-pointer mx-4 sm:mx-0">
                    <CardContent className="pt-6 text-center flex flex-col items-center">
                      <div className="flex flex-col items-center justify-center">
                        {feature.icon}
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                </Card>

            )
            
            
          })}
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industry Domains</p>
            </div>

               <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Role-Based Interview Questions</p>
            </div>

             <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">3x</h3>
              <p className="text-muted-foreground">Faster precision</p>
            </div>

             <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI support and assistance</p>
            </div>

          </div>

        </div>
       
      </section>

        <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works ?
            </h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       <section className="w-full py-12 md:py-24 bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to the most common questions about our platform
            </p>
          </div>

          <div className="max-w-6xl mx-auto">

             <Accordion type="single" collapsible className ="w-full">                   
                  {faqs.map((faq, index) => {
                    
                    return(
                      
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="hover:underline-none hover:no-underline cursor-pointer font-bold">
                          {faq.question}
                          </AccordionTrigger>
                           
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>

                    )
                                     
                  })}
            </Accordion>
          </div>
        </div>
      </section>


      <section className="w-full">
        <div className="mx-auto py-24 cta rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                Prepare Smarter. Succeed Faster.
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Redefining career development through innovation.
            </p>

            <a href="/SensAI(User Manual).pdf" download className="mt-5 inline-block">
              <Button size="lg" variant="secondary" className="h-11 mt-5 cursor-pointer">
                Download User Manual <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>


    </div>
  );
}