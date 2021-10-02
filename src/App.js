import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import instaHeaderLogo from "./image/insta-header-logo.png";
import Post from "./Post";
import { db, auth } from "./firebase";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    // to close the modal after the function is done
    setOpen(false);
  };
  const signIn = (event) => {
    // to prevent from refresh and other wierd stuffs
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage imgStyle"
                src={instaHeaderLogo}
                alt="header logo"
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type={!passwordToggle ? "password" : "text"}
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={
                !passwordToggle
                  ? "zmdi zmdi-eye-off text-center login-eye toggle-eye"
                  : "zmdi zmdi-eye text-center login-eye toggle-eye"
              }
              onClick={() => setPasswordToggle(!passwordToggle)}
            >
              {passwordToggle ? " Hide Password" : " Show Password"}
            </i>
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage imgStyle"
                src={instaHeaderLogo}
                alt="header logo"
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type={!passwordToggle ? "password" : "text"}
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={
                !passwordToggle
                  ? "zmdi zmdi-eye-off text-center login-eye toggle-eye"
                  : "zmdi zmdi-eye text-center login-eye toggle-eye"
              }
              onClick={() => setPasswordToggle(!passwordToggle)}
            >
              {passwordToggle ? " Hide Password" : " Show Password"}
            </i>
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage imgStyle"
          src={instaHeaderLogo}
          alt="insta-header-logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map((pst) => {
            return (
              <Post
                key={pst.id}
                postId={pst.id}
                user={user}
                username={pst.post.username}
                caption={pst.post.caption}
                imageUrl={pst.post.imageUrl}
              />
            );
          })}
        </div>
        <div className="app_postsRight"></div>
      </div>

      {
        //user? ---> it is known as optional
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3 style={{ textAlign: "center" }}>sorry!! you need to login</h3>
        )
      }
    </div>
  );
}

export default App;
