import { Outlet } from "react-router-dom"
import Navbar from "../aiSkillTest/components/Navbar"

const AISkillTestPage = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default AISkillTestPage