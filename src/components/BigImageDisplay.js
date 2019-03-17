import React, { Component } from "react";
import PropTypes from "prop-types";

export class BigImageDisplay extends Component {
  // Make sure to display comment as Markdown
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <img
            style={bigImageStyle}
            className="img-responsive float-left"
            src={this.props.outfit}
            alt={this.props.outfit}
          />
          <div className="col-xs-12">
            <p>{this.props.comment}</p>
          </div>
        </div>
      </div>
    );
  }
}

const bigImageStyle = {
  width: "50%",
  height: "auto",
  maxWidth: "1000px"
};

BigImageDisplay.propTypes = {
  outfit: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default BigImageDisplay;
