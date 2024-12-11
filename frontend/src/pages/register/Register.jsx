import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";
import logo from "../../assets/CoderConnectLogo3.png";  // Ensure the correct path for the logo

const Register = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [errorMessage, setErrorMessage] = useState(''); // For showing errors to the user

  const handleLoginClick = () => {
    navigate("/"); // Navigate to the login page
  };

  const typewriterTexts = [
    "Join us today!",
    "Start your journey here.",
    "Let’s get you registered!",
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const formData = { username, email, password };
    
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || 'Server responded with an error');
        });
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => {
      console.log("Registration successful:", data);
      navigate("/login"); // Navigate to login on success
    })
    .catch(error => {
      console.error("Error registering:", error);
      setErrorMessage('Registration failed. Please try again.');
    });
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

    // particles.js
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00ff73",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
        },
      },
      interactivity: {
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
        },
      },
      retina_detect: true,
    });
  }, []);

  return (
    <div className="register">
      <div id="particles-js"></div>
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
            <a href="#">
              <span className="material-icons">info</span>
              About Us
            </a>
          </li>
        </ul>
      </aside>
      <div className="content">
        <div className="card">
          <div className="left">
            <h1>Welcome to Coder Connect!</h1>
            <div className="typewriter-effect">{currentText}</div>
            <span>Already have an Account?</span>
            <button onClick={handleLoginClick}>Go to Login</button>
          </div>
          <div className="right">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Show error message */}
              <div className="button-wrapper">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
