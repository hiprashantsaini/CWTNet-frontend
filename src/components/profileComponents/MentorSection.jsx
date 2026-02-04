const MentorSection = ({ userData }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mentor List</h2>
      {userData.mentors?.length > 0 ? (
        <ul className="space-y-2">
          {userData.mentors.map((mentor) => (
            <li
              key={mentor.id}
              className="p-2 bg-white rounded shadow flex items-center"
            >
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <span className="font-semibold">{mentor.name}</span>
                <p className="text-sm text-gray-600">{mentor.expertise}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No mentors listed yet.</p>
      )}
    </div>
  );
};

export default MentorSection;
