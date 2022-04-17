import React from 'react';

const botBackgroundPanel = 'blue-grey lighten-5 left-align';
const botText = 'black-text';

const userBackgroundPanel = 'light-blue accent-3 right-align';
const userText = 'white-text';

const Message = (props) => (
  <div className="row m8 offset-m2 offset-l3 valign-wrapper">
    {props.speaks === 'bot' &&
    <div className="col s3">
      <a className="btn-floating btn-large waves-effect waves-light grey darken-1">{props.speaks}</a>
    </div>
    }
    <div className="col s9">
      <div className={`card-panel ${props.speaks === 'bot' ? botBackgroundPanel : userBackgroundPanel} valign-wrapper z-depth-1 hoverable`}
        style={{ padding: '10px 20px', wordBreak: 'break-word', borderRadius: '25px' }}
      >
          <span className={props.speaks === 'bot' ? botText : userText} style={{ width: '100%' }}>
            {props.text}
          </span>
      </div>
    </div>
    {props.speaks === 'user' &&
      <div className="col s3 right-align">
        <a className="btn-floating btn-large waves-effect waves-light orange lighten-1">{props.speaks}</a>
      </div>
      }
  </div>
);

export default Message;