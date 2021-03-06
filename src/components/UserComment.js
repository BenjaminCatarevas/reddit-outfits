import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ImageSelector } from "./ImageSelector";
import { BigImageDisplay } from "./BigImageDisplay";
import PropTypes from "prop-types";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

export class UserComment extends Component {
  state = {
    bigImageToDisplay: this.props.userInformation.outfits[0]
  };

  // Reference to give to ImageSelector
  topOfWindowRef = React.createRef();

  /**
   * This function sets the state of the big image to display to be the one passed in.
   * @param {string} imageUrl URL of image to display in larger format.
   */
  setBigImageToDisplay = imageUrl => {
    this.setState({ bigImageToDisplay: imageUrl });
  };

  render() {
    const { userInformation } = this.props;

    return (
      <div
        className="container"
        id="user-comment-displayer"
        style={commentContainerStyle}
      >
        <h6 style={textDisplayStyle}>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={userInformation.commentPermalink}
          >
            <OpenInNewIcon />
          </a>
        </h6>
        <BigImageDisplay
          bigImageToDisplay={this.state.bigImageToDisplay}
          comment={userInformation.commentBody}
        />
        <ImageSelector
          bigImageToDisplay={this.state.bigImageToDisplay}
          outfits={userInformation.outfits}
          setBigImageToDisplay={this.setBigImageToDisplay}
          topOfWindowRef={this.props.topOfWindowRef}
        />
      </div>
    );
  }
}

const commentContainerStyle = {
  border: "2px solid #8B8C89",
  marginTop: "10px",
  marginBottom: "10px",
  background: "#eee",
  width: "75%"
};

const textDisplayStyle = {
  textAlign: "center",
  marginTop: "7.5px",
  float: "right"
};

UserComment.propTypes = {
  userInformation: PropTypes.object.isRequired,
  topOfWindowRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

export default withRouter(UserComment);
