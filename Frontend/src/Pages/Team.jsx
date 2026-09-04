import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Mann Patel",
    role: "Backend Developer",
    about: "Building secure systems that power ScamShield behind the scenes.",
    image: "/team/Mann.jpeg",
  },
  {
    name: "Jaina Patel",
    role: "Frontend Developer",
    about: "Designing clean, intuitive interfaces for a safer user experience.",
    image: "/team/Jaina.jpg",
  },
  {
    name: "Aditya Kothari",
    role: "UI Designer",
    about: "Crafting simple, modern designs that make security feel effortless.",
    image: "/team/Aditya.png",
  },
  {
    name: "Nisarg Banjara",
    role: "AI Testing & Detection Specialist",
    about: "Testing intelligent detection to make ScamShield smarter and reliable.",
    image: "/team/Nisarg.jpg",
  },
  {
    name: "Neev Bhalavat",
    role: "Research & Documentation Lead",
    about: "Turning research and ideas into clear, meaningful documentation.",
    image: "/team/Neev.jpg",
  },
  {
    name: "Kankshit Bhatt",
    role: "Presentation & Demo Lead",
    about: "Bringing ScamShield to life through impactful demos and presentations.",
    image: "/team/Kankshit.jpg",
  },
];

function Team() {
  return (
    <main className="team-page">
      <div className="team-container">

        <div className="team-heading">
          <div className="team-badge">
            👥 OUR TEAM
          </div>

          <h1>
            Meet the <span>Team</span>
          </h1>

          <p>
            Different skills, one mission — building a safer digital
            experience with ScamShield.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={member.name}>

              <div className="team-photo-wrapper">
                <img
                    src={member.image}
                    alt={member.name}
                    className="team-photo"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                />

                <div className="member-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="team-info">
                <h2>{member.name}</h2>

                <div className="team-role">
                  {member.role}
                </div>

                <div className="team-line"></div>

                <p>{member.about}</p>
              </div>

            </div>
          ))}
        </div>

        <div className="team-message">
          <span>🛡</span>
          <p>
            Different skills. One mission. A safer digital world for everyone.
          </p>
        </div>

        <Link to="/" className="back-home">
          ← Back to ScamShield
        </Link>

      </div>
    </main>
  );
}

export default Team;