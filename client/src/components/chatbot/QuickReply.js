import React from 'react';

const QuickReply = (props) => {
  if (props.reply.payload) {
    return (
      <a style={{ margin: 3 }} href="" className="waves-effect waves-light btn-small blue darken-1"
        onClick={(event) => 
          props.click(
            event,
            props.reply.payload,
            props.reply.text
          )
        }>
          { props.reply.text }
      </a>
    );
  } else {
    return (
      <a style={{ margin: 3 }} target="_blank" href={props.reply.link} className="waves-effect waves-light btn-small blue darken-1">
          { props.reply.text }
      </a>
    );
  }
};

export default QuickReply;