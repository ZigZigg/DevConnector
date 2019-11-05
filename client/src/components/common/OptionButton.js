import React from "react";
import Button from "@material-ui/core/Button";
export default class ButtonOptions extends React.PureComponent {
  onViewClick = () => {
    const { handle, onView } = this.props;
    console.log(handle);
    onView(handle);
  };
  onEditClick = () => {
    const { id, onEdit } = this.props;
    onEdit(id);
  };
  onEnableClick = () => {
    const { id, onEnable } = this.props;
    onEnable(id);
  };
  onDelete = () => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };
  render() {
    const { isDisable, isCurrentDisable } = this.props;
    console.log(isDisable, isCurrentDisable);
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          className="cst-btn-link"
          onClick={this.onViewClick}
        >
          ViewProfile
        </Button>
        {isDisable && isDisable === true ? (
          <Button
            variant="contained"
            className="cst-btn-link"
            onClick={this.onEnableClick}
          >
            Enable
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className="cst-btn-link"
            onClick={this.onEditClick}
          >
            Disable
          </Button>
        )}
      </div>
    );
  }
}
