import "./comments.scss";
import userTemp from "../../assets/usertemp.jpg"; 

const Comments = () => {
  const currentUser = {
    profilePic: userTemp,
    name: "Current User"
  };

  const comments = [
    {
      id: 1,
      desc: "look at chapter 12",
      name: "User0001",
      userId: 1,
      profilePicture: userTemp,
    },
    {
      id: 2,
      desc: "maybe the error is at line 12?",
      name: "User0001",
      userId: 2,
      profilePicture: userTemp,
    },
  ];

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" />
        <button>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">1 hour ago</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
