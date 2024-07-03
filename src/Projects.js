import { Link } from "react-router-dom";
import "./styles.css";

const Projects = () => {
  return (
    <div className="container" style={{ padding: 30, marginTop: 50 }}>
      <h4>Projects</h4>
      <Link to="/test" className="link">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">Project 1</h5>
            <h6 className="card-subtitle mb-2 text-muted"></h6>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Projects;
