import { Suspense } from "react"
import {BarLoader} from "react-spinners"


const layout = ({children}) => {
  return (
    <div className="px-5">
        
        <Suspense fallback={<BarLoader  className="mt-8" width = {"100%"} color="gray" />}>

             {children}

        </Suspense>
    </div>
  )
}

export default layout
