import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

const AIGuru = () => {
  return (
    <div className="flex">
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default AIGuru