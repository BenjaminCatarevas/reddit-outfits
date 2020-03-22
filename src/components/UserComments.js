import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserComment from "./UserComment";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";

export class UserComments extends Component {
  componentDidMount() {
    // Extract URL parameters
    const {
      match: { params }
    } = this.props;
    // Once the component mounts, grab the comments of the given user.
    // TODO: Add check to see if 0 results. If so, redirect to error page.
    this.props.getCommentsFromSpecificUser(params.username);
  }

  sortByAscendingScore = () => {
    // Set state of App to sort comments by ascending score
    this.props.sortCommentsFromSpecificUserByAscendingScore();
  };

  sortByDescendingScore = () => {
    // Set state of App to sort comments by descending score
    this.props.sortCommentsFromSpecificUserByDescendingScore();
  };

  sortByAscendingDate = () => {
    // Set state of App to sort comments by ascending date
    this.props.sortCommentsFromSpecificUserByAscendingDate();
  };

  sortByDescendingDate = () => {
    // Set state of App to sort comments by descending date
    this.props.sortCommentsFromSpecificUserByDescendingDate();
  };

  render() {
    // Object mapping approach adapted from: https://stackoverflow.com/a/39965962
    return this.props.commentsFromSpecificUser.length !== 0 ? (
      <div>
        <h6>
          Posts by{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://reddit.com/u/${this.props.match.params.username}`}
          >
            /u/{this.props.match.params.username}
          </a>
        </h6>
        <button onClick={this.sortByAscendingScore}>Score ↑</button>
        <button onClick={this.sortByDescendingScore}>Score ↓</button>
        <button onClick={this.sortByAscendingDate}>Date ↑</button>
        <button onClick={this.sortByDescendingDate}>Date ↓</button>
        {this.props.commentsFromSpecificUser.map(comment => {
          // The key defaults to the comment ID, since that's the key to index into a given object.
          const topOfWindowRef = React.createRef();

          let threadDate = new Date(comment.commentTimestamp * 1000);
          let humanDate = threadDate.toDateString();

          return (
            <div key={comment.commentId}>
              <ExpansionPanel defaultExpanded={true} ref={topOfWindowRef}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Posted by{" "}
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://reddit.com/u/${comment.authorName}`}
                  >
                    {comment.authorName}
                  </a>
                  with a score of {comment.commentScore} on {humanDate} at{" "}
                  {threadDate.toLocaleTimeString("en-US")}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <UserComment
                    key={comment.commentId}
                    userInformation={comment}
                    topOfWindowRef={topOfWindowRef}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          );
        })}
      </div>
    ) : (
      <div>
        <CircularProgress />
      </div>
    );
  }
}

UserComments.propTypes = {
  getCommentsFromSpecificUser: PropTypes.func.isRequired,
  commentsFromSpecificUser: PropTypes.array.isRequired,
  sortCommentsFromSpecificUserByAscendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByDescendingScore: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByAscendingDate: PropTypes.func.isRequired,
  sortCommentsFromSpecificUserByDescendingDate: PropTypes.func.isRequired
};

export default withRouter(UserComments);
