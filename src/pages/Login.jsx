import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [toggleShowButton, setToggle] = useState(false);
  const [type, setType] = useState("password");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      login();
      navigate("/home");
    } catch (e) {
      setError(e);
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const showPassword = () => {
    setToggle(!toggleShowButton);

    if (toggleShowButton == true) {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <div className="login_content">
      {error && (
        <div className="login_error">Email o Password non corrette</div>
      )}
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login_form">
        <label>
          <p>
            <b>Email</b>
          </p>
          <br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          />
        </label>
        <label>
          <p>
            <b>Password</b>
          </p>
          <br />
          <input
            name="password"
            type={type}
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />
          <div id="toggleShow" onClick={showPassword}>
            Mostra Password
          </div>
        </label>
        <button type="submit">
          <b>Accedi</b>
        </button>
      </form>
    </div>
  );
};

export default Login;
