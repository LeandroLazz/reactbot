import React, { Component } from 'react';
import axios from 'axios/index';

import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  talkInput;

  constructor(props) {
    super(props);

    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.state = {
      messages: [],
      showBot: true,
      shopWelcomeSent: false,
      clientToken: false,
      regenerateToken: 0
    }

    if (cookies.get('userID') === undefined) {
      cookies.set('userID', uuid(), { path: '/' });
    }
  }

  async df_text_query(text) {
    let says = {
      speaks: 'user',
      msg: {
        text: {
          text: text
        }
      }
    };
    this.setState({ messages: [...this.state.messages, says] });

    const request = {
      queryInput: {
        text: {
          text: text,
          languageCode: 'en-US',
        },
      }
    };

    await this.df_client_call(request);

    // try {
    //   const res = await axios.post('/api/df_text_query', {text: text, userID: cookies.get('userID')});

    //   for (let msg of res.data.fulfillmentMessages) {
    //     says = {
    //       speaks: 'bot',
    //       msg: msg
    //     }
    //     this.setState({ messages: [...this.state.messages, says] });
    //   }
    // } catch (e) {
    //   says = {
    //     speaks: 'bot',
    //     msg: {
    //       text : {
    //         text: "I'm having troubles. I need to terminate. will be back later"
    //       }
    //     }
    //   }
    //   this.setState({ messages: [...this.state.messages, says]});

    //   let that = this;

    //   setTimeout(function(){
    //     that.setState({ showBot: false})
    //   }, 2000);
    // }
  }

  async df_event_query(event) {
    const request = {
      queryInput: {
        event: {
          name: event,
          languageCode: 'en-US',
        },
      }
    };

    await this.df_client_call(request);
    // try {
    //   const res = await axios.post('/api/df_event_query', {event: event, userID: cookies.get('userID')});

    //   for (let msg of res.data.fulfillmentMessages) {
    //     let says = {
    //       speaks: 'bot',
    //       msg: msg
    //     };
    //     this.setState({ messages: [...this.state.messages, says] });
    //   }
    // } catch (e) {
    //   let says = {
    //     speaks: 'bot',
    //     msg: {
    //       text : {
    //         text: "I'm having troubles. I need to terminate. will be back later"
    //       }
    //     }
    //   }
    //   this.setState({ messages: [...this.state.messages, says]});

    //   let that = this;
    //   setTimeout(function(){
    //     that.setState({ showBot: false})
    //   }, 2000);
    // }
  }

  async df_client_call (request) {
    try {
      if (this.state.clientToken === false) {
        const res = await axios.get('/api/get_client_token');
        this.setState({clientToken: res.data.token});
      }

      var config = {
        headers: {
          'Authorization': "Bearer " + this.state.clientToken,
          'Content-Type': 'application/json; charset=utf-8'
        }
      };

      const res = await axios.post(
        'https://dialogflow.googleapis.com/v2/projects/reactpageagent-tfpm' +
        '/agent/sessions/react-bot-session' + cookies.get('userID') + ':detectIntent',
        request,
        config
      );

      let  says = {};

      if (res.data.queryResult.fulfillmentMessages ) {
        for (let msg of res.data.queryResult.fulfillmentMessages) {
          says = {
            speaks: 'bot',
            msg: msg
          }
          this.setState({ messages: [...this.state.messages, says]});
        }
      }

      this.setState({ regenerateToken: 0});

    } catch (e) {
      if (e.response.status === 401 && this.state.regenerateToken < 1) {
        this.setState({ clientToken: false, regenerateToken: 1 });
        this.df_client_call(request);
      } else {
        let says = {
          speaks: 'bot',
          msg: {
            text : {
              text: "I'm having troubles. I need to terminate. will be back later"}
          }
        }
        this.setState({ messages: [...this.state.messages, says]});

        let that = this;

        setTimeout(function(){
            that.setState({ showBot: false})
        }, 2000);
      }
    }
  }

  resolveAfterXSeconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
          resolve(x);
      }, x * 1000);
    })
  }

  async componentDidMount() {
    this.df_event_query('Welcome');

    if (window.location.pathname === '/shop' && !this.state.shopWelcomeSent) {
      await this.resolveAfterXSeconds(1);
      this.df_event_query('WELCOME_SHOP');
      this.setState({ shopWelcomeSent: true, showBot: true });
    }
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: 'auto'});
    if ( this.talkInput ) {
      this.talkInput.focus();
    }
  }

  show(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({showBot: true});
  }

  hide(event) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({showBot: false});
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case 'recommended_yes':
        this.df_event_query('SHOW_RECOMMENDATIONS');
        break;
      case 'training_masterclass':
        this.df_event_query('MASTERCLASS');
        break;
      default:
        this.df_text_query(text);
        break;
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
    } else if(message.msg && 
      message.msg.payload && 
      message.msg.payload.cards
    ) {
      return <div key={i}>
        <div className="card-panel grey lighten-5 z-depth-1">
          <div style={{ overflow: 'hidden' }}>
            <div className="col s2">
              <a className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
            </div>
            <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
              <div style={{ height: 340, width: message.msg.payload.cards.length * 270 }}>
                { this.renderCards(message.msg.payload.cards) }
              </div>
            </div>
          </div>
        </div>
      </div>
    } else if (message.msg && 
      message.msg.payload && 
      message.msg.payload.quick_replies
    ) {
      return <QuickReplies 
        text={message.msg.payload.text ? message.msg.payload.text : null} 
        key={i} 
        replyClick={this._handleQuickReplyPayload} 
        speaks={message.speaks} 
        payload={message.msg.payload.quick_replies}/>;
    }
  }

  renderMessages(returnedMessages) {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    if (this.state.showBot) {
      return (
        <div className="z-depth-4" style={{ minHeight: 500, maxHeight: 470, width: 400, position: 'absolute', bottom: 0, right: 20, borderTopRightRadius: '20px', borderTopLeftRadius: '20px', overflow: 'hidden' }}>
          <nav>
            <div className="nav-wrapper light-blue accent-4" style={{ paddingLeft: '20px'}}>
              <a href="#" className="brand-logo" style={{ fontSize: '1.3rem' }}>ChatBot Support</a>
              <ul id="nav-mobile" className="right">
                <li><a href="#" onClick={this.hide}>Close</a></li>
              </ul>
            </div>
          </nav>
          <div id="chatbot" className="grey lighten-4" style={{ height: 388, width: '100%', overflow: 'auto', padding: '10px 30px'}}>
            {this.renderMessages(this.state.messages)}
            <div ref={(el) => { this.messagesEnd = el; }}
              style={{ float: 'left', clear: 'both' }}>
            </div>
          </div>
          <div className="col s12">
            <input style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} placeholder="type a message: " type="text" onKeyPress={this._handleInputKeyPress} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="z-depth-4" style={{ minHeight: 40, maxHeight: 470, width:400, position: 'absolute', bottom: 0, right: 20, borderTopRightRadius: '20px', borderTopLeftRadius: '20px', overflow: 'hidden' }}>
          <nav>
            <div className="nav-wrapper light-blue accent-4" style={{ paddingLeft: '20px'}}>
              <a href="#" className="brand-logo" style={{ fontSize: '1.3rem' }}>ChatBot Support</a>
              <ul id="nav-mobile" className="right">
                <li><a href="#" onClick={this.show}>Show</a></li>
              </ul>
            </div>
          </nav>
          <div ref={(el) => { this.messagesEnd = el; }}
            style={{ float:"left", clear: "both" }}>
          </div>
        </div>
      );
    }
  }
}

export default Chatbot;