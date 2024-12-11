import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import logo from "../../assets/CoderConnectLogo3.png";  // Ensure the correct path for the logo
import axios from 'axios'; // For making HTTP requests

const Login = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const typewriterTexts = [
    "Welcome back!",
    "Login to your account.",
    "Let’s get started!",
  ];

  // Handle form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        userID: email,  // Assuming the email is used as the userID
        password: password
      });

      // Assuming the response contains the access token
      localStorage.setItem('access_token', response.data.access_token); // Store token in localStorage

      // Redirect user after successful login
      navigate("/home"); // Change this to a valid route

    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    const typeWriter = () => {
      let i = 0;
      let textPos = 0;
      let currentString = typewriterTexts[i];
      const speed = 100;
      const deleteSpeed = 50;
      const waitTime = 2000;

      const type = () => {
        setCurrentText(currentString.substring(0, textPos) + '_');

        if (textPos++ === currentString.length) {
          setTimeout(() => deleteText(), waitTime);
        } else {
          setTimeout(type, speed);
        }
      };

      const deleteText = () => {
        setCurrentText(currentString.substring(0, textPos) + '_');

        if (textPos-- === 0) {
          i = (i + 1) % typewriterTexts.length;
          currentString = typewriterTexts[i];
          setTimeout(type, speed);
        } else {
          setTimeout(deleteText, deleteSpeed);
        }
      };

      type();
    };

    typeWriter();

    // Particles.js initialization
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.5
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00ff73",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6
        }
      },
      interactivity: {
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          }
        }
      },
      retina_detect: true
    });
  }, []);

  return (
    <div className="login">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" />
          <h2>Coder Connect</h2>
        </div>
        <ul className="sidebar-links">
          <li>
            <a href="#">
              <span className="material-icons">dashboard</span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" onClick={handleRegisterClick}>
              <span className="material-icons">info</span>
              Register
            </a>
          </li>
        </ul>
      </aside>
      <div className="content">
        <div className="card">
          <div className="left">
            <h1>Welcome to Coder Connect!</h1>
            <div className="typewriter-effect">{currentText}</div>
            <span>New here?</span>
            <button onClick={handleRegisterClick}>Go to Register</button>
          </div>
          <div className="right">
            <h1>Login</h1>
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className="button-wrapper">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="particles-js"></div>
    </div>
  );
};

export default Login;