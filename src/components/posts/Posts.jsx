import Post from "../post/post";
import "./posts.scss";
import problem from '../../assets/problem.png'; 
import catpfp from '../../assets/catpfp.png'; 


const Posts = () => {
  const posts = [
    {
      id: 1,
      name: "BestProgrammer6969",
      userId: 1,
      profilePic: catpfp,
      desc: "guysss my code isnt workingggg",
      img: problem,
    },
    {
      id: 2,
      name: "Badatmath",
      userId: 2,
      profilePic: catpfp,
      desc: "what is the answer for number one on the midterm?",
    },
  ];

  return <div className="posts">
    {posts.map(post=>(
      <Post post={post} key={post.id}/>
    ))}
  </div>;
};

export default Posts;