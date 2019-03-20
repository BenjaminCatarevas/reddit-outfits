import React, { Component } from "react";
import { withRouter, BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import UserComments from "./components/UserComments";
import NavigationBar from "./components/NavigationBar";
import About from "./components/About";
import ThreadList from "./components/ThreadList";
import Users from "./components/Users";
import ThreadDisplayer from "./components/ThreadDisplayer";

class App extends Component {
  state = {
    allUsers: null,
    allThreads: null,
    commentsFromSpecificUser: null,
    commentsFromSpecificThread: null
  };

  // NOTE: These functions will replace the axios URL with a server.
  getCommentsFromSpecificUser = user => {
    axios
      .get(`http://localhost:3001/u/${user}`)
      .then(res => {
        this.setState({
          commentsFromSpecificUser: res.data.specificUserComments
        });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getAllUsers = () => {
    axios
      .get("http://localhost:3001/users")
      .then(res => {
        this.setState({ allUsers: res.data.allUsers });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getAllThreads = () => {
    axios
      .get("http://localhost:3001/threads")
      .then(res => {
        this.setState({ allThreads: res.data.allThreads });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getThreadsBySubreddit = subreddit => {
    axios
      .get(`http://localhost:3001/r/${subreddit}`)
      .then(res => {
        this.setState({ allThreads: res.data.subredditThreads });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  getCommentsOfThreadByThreadId = (subreddit, threadId) => {
    axios
      .get(`http://localhost:3001/r/${subreddit}/${threadId}`)
      .then(res => {
        this.setState({ commentsFromSpecificThread: res.data.threadOutfits });
      })
      .catch(err => console.log("Error: ", err.message));
  };

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
              <a style={{ color: "black", textDecoration: "none" }} href="/">
                Reddit Outfits
              </a>
            </h1>
            <h6 style={{ textAlign: "center", color: "#555" }}>
              View outfits, threads, and more of reddit's fashion communities
            </h6>
            <NavigationBar
              getCommentsFromSpecificUser={this.getCommentsFromSpecificUser}
              commentsFromSpecificUser={this.state.commentsFromSpecificUser}
              {...this.props}
            />
            <Route exact path="/" {...this.props} />
            <Route
              path="/u/:username"
              render={props => (
                <div>
                  <UserComments
                    getCommentsFromSpecificUser={
                      this.getCommentsFromSpecificUser
                    }
                    commentsFromSpecificUser={
                      this.state.commentsFromSpecificUser
                    }
                    {...props}
                  />{" "}
                </div>
              )}
            />
            <Route
              exact
              path="/r/:subreddit"
              render={props => (
                <div>
                  <ThreadList
                    getThreadsBySubreddit={this.getThreadsBySubreddit}
                    getAllThreads={this.getAllThreads}
                    allThreads={this.state.allThreads}
                    {...props}
                  />{" "}
                </div>
              )}
            />
            <Route
              path="/users"
              render={props => (
                <div>
                  <Users
                    getAllUsers={this.getAllUsers}
                    allUsers={this.state.allUsers}
                    {...props}
                  />{" "}
                </div>
              )}
            />
            <Route
              path="/r/:subreddit/:threadId"
              render={props => (
                <div>
                  <ThreadDisplayer
                    getCommentsOfThreadByThreadId={
                      this.getCommentsOfThreadByThreadId
                    }
                    commentsFromSpecificThread={
                      this.state.commentsFromSpecificThread
                    }
                    {...props}
                  />
                </div>
              )}
            />
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default withRouter(App);
