import "./rightBar.scss";
import catpfp from '../../assets/catpfp.png'; 
import chaticon from '../../assets/chaticon.png'; 
import { Link } from 'react-router-dom'; // Import Link

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Connect with other Coders</span>
          <div className="user">
            <div className="userInfo">
              <img src={catpfp} alt="User Profile" />
              <span>hawk 1</span>
            </div>
            <div className="buttons">
              <button>follow</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src={catpfp} alt="User Profile" />
              <span>hawk 2</span>
            </div>
            <div className="buttons">
              <button>follow</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Chat Rooms</span>
          <Link to="/chatroom" style={{ textDecoration: 'none' }}>
            <div className="user">
              <div className="userInfo">
                <img src={chaticon} alt="Chat Icon" />
                <div className="online" />
                <span>Post "guysss my code isnt work..."</span>
              </div>
            </div>
          </Link>
          <Link to="/chatroom" style={{ textDecoration: 'none' }}>
            <div className="user">
              <div className="userInfo">
                <img src={chaticon} alt="Chat Icon" />
                <div className="online" />
                <span>Post "what is the answer for num..."</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
