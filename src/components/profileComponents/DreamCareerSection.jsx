const DreamCareerSection = ({ userData, isOwnProfile }) => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Dream Career</h2>
        <p>{userData.dreamCareer || "No information provided."}</p>
        {isOwnProfile && <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Edit</button>}
      </div>
    );
  };
  
  export default DreamCareerSection;
  