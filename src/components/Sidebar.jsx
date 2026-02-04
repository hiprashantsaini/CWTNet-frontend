import { Link } from "react-router-dom";

export default function Sidebar({ user }) {
  return (
    <div className="bg-white border shadow-lg rounded-lg w-72 p-4 text-center">
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-gray-300"
        />
        <h2 className="text-xl font-bold mt-2">{user.name || "Name"}</h2>
        <p className="text-lg font-semibold">{user.headline || 'My Dream / Bio'}</p>
      </div>

      {/* Skill Test Section */}
      <div className="border-t border-t-black my-4 py-2">
        <Link to="/aiskill/assessment" className="text-lg font-semibold flex justify-center items-center">
          Skill Test
        </Link>
        {
          user.type === 'Seeker' ? (
            <Link to='/aiguru' className="text-lg font-semibold cursor-pointer">AI Guru</Link>
          ) : (
            <>
              <p className="text-lg font-semibold flex justify-center items-center">
                Rating
              </p>
              <p className="text-lg font-semibold flex justify-center items-center">
                Reviews
              </p>
            </>
          )
        }
      </div>

      {/* Additional Links */}
      <div className="border-t border-t-black my-4 py-2 text-center flex flex-col">
        {user.type==='Provider' &&  <p className="text-lg font-semibold">Pages</p>}
        <Link to='/events' className="text-lg font-semibold">Events</Link>
        <Link to="/internships" className="text-lg font-semibold">Internships</Link>
       
      </div>
    </div>
  );
}

