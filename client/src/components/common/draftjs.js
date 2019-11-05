import React from "react";
// import ReactDOM from 'react-dom';
import {
  Editor,
  ContentState,
  convertFromHTML,
  EditorState,
  RichUtils,
  getDefaultKeyBinding
} from "draft-js";
import { convertToHTML } from "draft-convert";

import "./index.css";

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    let defaultEditorState = !props.defaultContent
      ? EditorState.createEmpty()
      : EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(props.defaultContent)
          )
        );
    this.state = {
      editorState: defaultEditorState
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => {
      this.setState({ editorState });
      const html = convertToHTML({
        blockToHTML: block => {
          if (block.type === "code-block") {
            return <code />;
          }
        }
      })(editorState.getCurrentContent());
      this.props.onChange(html);
    };
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.handleBeforeInput = this._handleBeforeInput.bind(this);
    this.handlePastedText = this._handlePastedText.bind(this);
  }
  _getLengthOfSelectedText = () => {
    const currentSelection = this.state.editorState.getSelection();
    const isCollapsed = currentSelection.isCollapsed();

    let length = 0;

    if (!isCollapsed) {
      const currentContent = this.state.editorState.getCurrentContent();
      const startKey = currentSelection.getStartKey();
      const endKey = currentSelection.getEndKey();
      const startBlock = currentContent.getBlockForKey(startKey);
      const isStartAndEndBlockAreTheSame = startKey === endKey;
      const startBlockTextLength = startBlock.getLength();
      const startSelectedTextLength =
        startBlockTextLength - currentSelection.getStartOffset();
      const endSelectedTextLength = currentSelection.getEndOffset();
      const keyAfterEnd = currentContent.getKeyAfter(endKey);
      if (isStartAndEndBlockAreTheSame) {
        length +=
          currentSelection.getEndOffset() - currentSelection.getStartOffset();
      } else {
        let currentKey = startKey;

        while (currentKey && currentKey !== keyAfterEnd) {
          if (currentKey === startKey) {
            length += startSelectedTextLength + 1;
          } else if (currentKey === endKey) {
            length += endSelectedTextLength;
          } else {
            length += currentContent.getBlockForKey(currentKey).getLength() + 1;
          }

          currentKey = currentContent.getKeyAfter(currentKey);
        }
      }
    }

    return length;
  };

  _handleBeforeInput = () => {
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText("").length;
    const selectedTextLength = this._getLengthOfSelectedText();
    if (
      currentContentLength - selectedTextLength > this.props.maxLength - 1 &&
      this.props.maxLength
    ) {
      return "handled";
    }
  };

  _handlePastedText = pastedText => {
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText("").length;
    const selectedTextLength = this._getLengthOfSelectedText();

    if (
      this.props.maxLength &&
      currentContentLength + pastedText.length - selectedTextLength >
        this.props.maxLength
    ) {
      return "handled";
    }
  };
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }
    return (
      <div className="RichEditor-root">
        <div className="EditorToolbar">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            handleBeforeInput={this.handleBeforeInput}
            handlePastedText={this.handlePastedText}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontSize: 16,
    padding: 2
  }
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}
const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code", style: "code-block" }
];
const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" }
];
const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
