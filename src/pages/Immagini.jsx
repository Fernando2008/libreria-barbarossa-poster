import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { db, storage } from "../firebaseConfig";
import { ref as dbRef, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "../css/Immagini.css";

const Immagini = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [imageUri, setImageUri] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRouteBack = () => {
    navigate("/home");
  };

  const handleImageUri = async (event) => {
    const file = event.target.files[0];
    setImageUri(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUri) {
      alert("Aggiungi un'immagine");
      return;
    }

    try {
      const timestamp = Date.now();
      const imageStorageRef = storageRef(storage, `page_images/${timestamp}`);
      await uploadBytes(imageStorageRef, imageUri);

      const url = await getDownloadURL(imageStorageRef);

      const imageRef = dbRef(db, `pages_images/${timestamp}`);

      await set(imageRef, {
        timestamp,
        url,
      });

      setImageUri(null);
      alert("Immagine aggiunta con successo!");
    } catch (error) {
      console.error("Errore durante la creazione dell'immagine: ", error);
      alert("Errore nel creare l'immagine.");
    }
  };

  return (
    <div className="images_content">
      <h1>IMMAGINI</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Immagine
          <input type="file" onChange={handleImageUri} required />
        </label>
        <button type="submit">
          <b>Aggiungi Immagine</b>
        </button>
      </form>
      <div className="images_buttons">
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

export default Immagini;
