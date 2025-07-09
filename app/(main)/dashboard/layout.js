import { Suspense } from "react"
import {BarLoader} from "react-spinners"


const layout = ({children}) => {
  return (
    <div className="px-5">

        <div className="flex items-center justify-between mb-5">
            <h1 className="text-4xl lg:text-5xl font-bold gradient-title" >Industry Insights
            </h1>
        </div>

        <Suspense fallback={<BarLoader  className="mt-8" width = {"100%"} color="gray" />}>

             {children}

        </Suspense>
    </div>
  )
}

export default layout
