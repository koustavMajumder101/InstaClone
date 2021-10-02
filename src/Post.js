import React, { useState, useEffect } from "react";
import "./CSS/Post.css";
import { Avatar } from "@material-ui/core";
import firebase from "firebase";
import { db } from "./firebase";

const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      comment: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      {/*header---> avatar + username */}
      <img className="post_image" src={imageUrl} alt="post" />
      {/* image */}
      <h4 className="post_text">
        <strong className="username_section">{username}:</strong> {caption}{" "}
      </h4>
      {/* useranme + caption */}

      <div className="post_comments">
        {comments.map((comment) => {
          return (
            <p>
              <strong className="username_section">{comment.username}</strong>{" "}
              {comment.comment}
            </p>
          );
        })}
      </div>
      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
