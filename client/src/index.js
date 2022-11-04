import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css';

const client = new W3CWebSocket('ws://localhost:8000'); // create client connected to localhost on port 8000

// create class components to handle the chat 
const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

export default class App extends Component {

    state = {
        username: '',
        isLoggedIn: false,
        messages: []
    }

    // send message to server when button is clicked
    onButtonClick = (value) => {
        client.send(
            JSON.stringify({
                type: 'message',
                message: value,
                username: this.state.username
            })
        )
        this.setState({searchVal: '' })
    }
    componentDidMount() {
        // called when client is connected to server
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        }
        // called when client receives message from server
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log(`message recieved: ${message.data}`)
            // update state with new messages
            if (dataFromServer.type === 'message') {
                this.setState((state) => ({
                    messages: [...state.messages,
                    {
                        message: dataFromServer.message,
                        username: dataFromServer.username
                    }]
                }))
            }
        }
    }

    render() {
        return (
            <div className="main">
                {this.state.isLoggedIn ?
                    // Mesagging page
                    <div>
                        {/* title thingy */}
                        <div className="title">
                            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>WhatsABB</Text>
                        </div>
                        {/* messgage boxes thingy */}
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
                            {this.state.messages.map(message =>
                                <Card key={message.message} style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.username === message.username ? 'flex-end' : 'flex-start' }} loading={false}>
                                    <Meta
                                        avatar={
                                            <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{message.username[0].toUpperCase()}</Avatar>
                                        }
                                        title={message.username + ":"}
                                        description={message.message}
                                    />
                                </Card>
                            )}
                        </div>
                        {/* messgage entry thingy w/ button*/}
                        <div className="bottom">
                            <Search
                                placeholder="input message and send"
                                enterButton="Send"
                                value={this.state.searchVal}
                                size="large"
                                onChange={(e) => this.setState({ searchVal: e.target.value })}
                                onSearch={value => this.onButtonClick(value)}
                            />
                        </div>

                    </div>
                    :
                    // Login page
                    <div style={{ padding: '200px 40px' }}>
                        <Search
                            placeholder="input username"
                            enterButton="Login"
                            size="large"
                            onSearch={value => this.setState({ username: value, isLoggedIn: true })}
                        />
                    </div>
                }

            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));