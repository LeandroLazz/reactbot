import React, { Component } from 'react';
import QuickReply from './QuickReply';

class QuickReplies extends Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }

  _handleClick(event, payload, text) {
    this.props.replyClick(event, payload, text);
  }

  renderQuickReply(reply, i) {
    return <QuickReply key={i} click={this._handleClick} reply={reply} />;
  }

  renderQuickReplies(quickReplies) {
    if (quickReplies) {
      return quickReplies.map((reply, i) => {
        return this.renderQuickReply(reply, i);
      })
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="row m8 offset-m2 l6 offset-l3 valign-wrapper">
        <div className="col s3">
          <a href="/" className="btn-floating btn-large waves-effect waves-light grey darken-1">
            { this.props.speaks }
          </a>
        </div>
        <div className="col s9">
          <div className="card-panel blue-grey lighten-5 left-align z-depth-1 valign-wrapper"
            style={{ padding: '10px 20px', wordBreak: 'break-word', borderRadius: '25px' }}
          >
            <div id="quick-replies">
              { this.props.text && <p>
                { this.props.text }
              </p>
              }
              { this.renderQuickReplies(this.props.payload) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuickReplies;