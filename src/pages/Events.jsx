import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { db, storage } from "../firebaseConfig";
import { ref as dbRef, set, get } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import "../css/Events.css";

const Events = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [prodAuthor, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [prodDate, setDate] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [idRic, setIdRic] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRouteBack = () => {
    navigate("/home");
  };

  const handleImageUri = (event) => {
    const file = event.target.files[0];
    setImageUri(file);
  };

  const fetchMaxIdRic = async () => {
    const eventsRef = dbRef(db, "eventi");
    const snapshot = await get(eventsRef);

    let maxIdRic = 0;

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val();
        if (event.idRiconoscimento > maxIdRic) {
          maxIdRic = event.idRiconoscimento;
          console.log(maxIdRic);
        }
      });
    }

    setIdRic(maxIdRic + 1);
  };

  useEffect(() => {
    fetchMaxIdRic();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUri) {
      alert("Aggiungi un'immagine");
      return;
    }

    try {
      const imageStorageRef = storageRef(storage, `images/${v4()}`);
      await uploadBytes(imageStorageRef, imageUri);

      const url = await getDownloadURL(imageStorageRef);

      const titolo = title;
      const author = prodAuthor;
      const date = prodDate;
      const idRiconoscimento = idRic;

      const eventRef = dbRef(db, "eventi/" + v4());
      await set(eventRef, {
        titolo,
        author,
        desc,
        date,
        url,
        isAvailable: true,
        idRiconoscimento,
      });

      setTitle("");
      setAuthor("");
      setDesc("");
      setDate("");
      setImageUri(null);
      alert("Evento creato con successo!");

      fetchMaxIdRic();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Errore nel creare l'evento");
    }
  };

  return (
    <div className="events_content">
      <h2>EVENTI</h2>
      <form onSubmit={handleSubmit} className="events_form">
        <label>
          Titolo
          <input
            type="text"
            placeholder="Titolo dell'evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Autore
          <input
            type="text"
            placeholder="Autore dell'evento"
            value={prodAuthor}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>

        <label>
          Descrizione
          <input
            type="text"
            placeholder="Descrizione dell'evento"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </label>

        <label>
          Data
          <input
            type="text"
            placeholder="Data dell'evento"
            value={prodDate}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Immagine
          <input type="file" onChange={handleImageUri} required />
        </label>
        <button type="submit">
          <b>Aggiungi Evento</b>
        </button>
      </form>
      <div className="events_buttons">
        <button onClick={handleRouteBack}>
          <b>Torna Indietro</b>
        </button>
        <button onClick={handleLogout}>
          <b>Esci</b>
        </button>
      </div>
    </div>
  );
};

export default Events;
