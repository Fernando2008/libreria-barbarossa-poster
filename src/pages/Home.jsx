import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import "../css/Home.css";

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEvents = () => {
    navigate("/events");
  };

  const handleImmagini = () => {
    navigate("/immagini");
  };

  return (
    <div className="home_content">
      <h1>HOME</h1>
      <div className="home_cards">
        <button onClick={handleEvents}>
          <b>Aggiungi un Nuovo Evento</b>
        </button>
        <button onClick={handleImmagini}>
          <b>Aggiungi una Nuova Immagine</b>
        </button>
      </div>
      <button onClick={handleLogout}>
        <b>Esci</b>
      </button>
    </div>
  );
};

export default Home;
