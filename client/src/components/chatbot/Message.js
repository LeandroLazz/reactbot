import React from 'react';

const Message = (props) => (
  <div className="col s12 m8 offset-m2 offset-l3">
    <div className="card-panel grey lighten-4 z-depth-1 hoverable">
      <div className="row valign-wrapper">
        {props.speaks === 'bot' &&
        <div className="col s3">
          <a className="btn-floating btn-large waves-effect waves-light teal accent-4">{props.speaks}</a>
        </div>
        }
        <div className="col s9">
          <span className="black-text">
            {props.text}
          </span>
        </div>
        {props.speaks === 'user' &&
        <div className="col s3">
          <a className="btn-floating btn-large waves-effect waves-light teal accent-4">{props.speaks}</a>
        </div>
        }
      </div>
    </div>
  </div>
);

export default Message;