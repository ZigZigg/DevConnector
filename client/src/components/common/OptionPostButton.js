import React from "react";
import Button from "@material-ui/core/Button";
export default class PostButton extends React.PureComponent {
  onViewClick = () => {
    const { id, onView } = this.props;
    onView(id);
  };
  onUnpublishClick = () => {
    const { id, onUnpublish } = this.props;
    onUnpublish(id);
  };
  onPublishClick = () => {
    const { id, onPublish } = this.props;
    onPublish(id);
  };
  render() {
    const { isPublished } = this.props;
    // console.log(isDisable, isCurrentDisable);
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          className="cst-btn-link"
          onClick={this.onViewClick}
        >
          View Post
        </Button>
        {isPublished && isPublished === true ? (
          <Button
            variant="contained"
            color="primary"
            className="cst-btn-link"
            onClick={this.onUnpublishClick}
          >
            Unpublished
          </Button>
        ) : (
          <Button
            variant="contained"
            className="cst-btn-link"
            onClick={this.onPublishClick}
          >
            Published
          </Button>
        )}
      </div>
    );
  }
}
