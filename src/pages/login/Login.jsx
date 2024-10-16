import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.scss"; 
import logo from "./CoderConnectLogo3.png"; 

const Login = () => {
  const navigate = useNavigate(); 
  const [currentText, setCurrentText] = useState('');

  const handleRegisterClick = () => {
    navigate("/register"); 
  };

  const typewriterTexts = [
    "Welcome back!",
    "Login to your account.",
    "Let’s get started!",
  ]; 
  
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

    //particles.js
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
            <form>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <div className="button-wrapper">
                <button type="submit">Login</button>
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
