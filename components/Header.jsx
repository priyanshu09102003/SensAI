import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { CheckCircle, ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { checkUser } from '@/lib/checkUser'

const Header = async () => {

    //Everytime we land on the app, we check if the user is the part of our database or not. If not, we create a new user through the checkUser() function and push it to our database 
    await checkUser(); 
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>

        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href='/' className='flex gap-1'>

             <Image src='/logo.svg' width={38} height={32} alt = "SensAI Logo" 
            className=' h-12 py-2 w-auto object-contain'
            />

            <Image src='/logo.png' width={200} height={60} alt = "SensAI Logo" 
            className='h-12 py-1 w-auto object-contain'
            />
            
            </Link>

            <div className='flex items-center space-x-2 md:space-x-4'>
                <SignedIn>
                    <Link href={'/dashboard'}>
                        <Button className="cursor-pointer" variant="secondary">
                            <LayoutDashboard className='h-4 w-4' /> 
                            <span className='hidden md:block'>Industry Insights</span>
                        </Button>
                    </Link>
                    

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>

                            <Button className="cursor-pointer">
                                <StarsIcon className='h-4 w-4' /> 
                                <span className='hidden md:block'>Career Toolkit</span>
                                <ChevronDown className='h-4 w-4' /> 
                            </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel>Your AI Suite</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <Link href={"/resume"} className='flex items-center gap-2'>
                                    <FileText className='h-6 w-6' /> 
                                    <span >Build Resume</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={"/ai-cover-letter"} className='flex items-center gap-2'>
                                    <PenBox className='h-6 w-6' /> 
                                    <span >Generate Cover Letter</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={"/interview"} className='flex items-center gap-2'>
                                    <GraduationCap className='h-6 w-6' /> 
                                    <span >Interview Prep Lab</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={"/ats"} className='flex items-center gap-2'>
                                    <CheckCircle className='h-6 w-6' /> 
                                    <span >ATS Tracker</span>
                                </Link>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>





                </SignedIn>

                 <SignedOut>
                    <SignInButton>
                        <Button variant="destructive" className="cursor-pointer">Sign In</Button>
                    </SignInButton>
                    </SignedOut>


                    <SignedIn>
                        <UserButton 
                        appearance={{
                            elements : {
                                avatarBox:{
                                    width: 40,
                                    height: 40
                                },
                                avatarImage: "w-12 h-12",
                                userButtonPopoverCard : "shadow-xl" ,
                                userPreviewMainIdentifier : "font-semibold"
                            }
                        }}
                        afterSignOutUrl='/'
                        />
                    </SignedIn>


            </div>
        </nav>

         
    </header>
  )
}

export default Header
