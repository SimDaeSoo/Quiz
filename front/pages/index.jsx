
import Head from '../components/head';
import GameClient from '../classes/client';
import GameRenderer from '../classes/renderer';
import LoginCard from '../components/loginCard';
import { message } from 'antd';
import { ApiOutlined } from '@ant-design/icons';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialize: false, name: '', character: 1, token: '', connected: false, ping: 0 };
  }

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    const SOCKET_ADDRESS = 'http://0.0.0.0:3333';
    this.client = new GameClient();
    this.client.setStateCallback((state) => { this.setState(state); });
    await this.client.cetrification();
    this.client.connect(`${SOCKET_ADDRESS}`);
  }

  join = () => {
    const { name, character } = this.state;

    if (name && character) {
    } else {
      message.error('Please Insert Your Name.');
    }
  }

  create = () => {
    const { name, character } = this.state;

    if (name && character) {
      this.client.applyCreateRoom();
    } else {
      message.error('Please Insert Your Name.');
    }
  }

  createRenderer = () => {
    this.renderer = new GameRenderer();
    this.renderer.initialize({ el: this.refs.main });

    this.client.setRenderer(this.renderer);
    const initialize = true;
    this.setState({ initialize });
  }

  destroy = () => {
    this.client.destroy();
    this.renderer.destroy();
  }

  setName = (e) => {
    const name = e.target.value;
    this.setState({ name });
  }

  setCharacter = (e) => {
    const character = e.target.value;
    this.setState({ character });
  }

  render() {
    const { initialize, connected, ping, token } = this.state;
    return (
      <div ref='main' className="main">
        <Head />
        {
          !initialize &&
          <LoginCard join={this.join} setName={this.setName} setCharacter={this.setCharacter} create={this.create} token={token} />
        }

        <div style={{ position: 'absolute', right: '4px', bottom: '5px', height: '22px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'background-color 0.3s' }}>
          <ApiOutlined /> {connected ? 'Connected' : 'Disconnected'}
        </div>

        <div style={{ fontSize: '0.5em', position: 'absolute', left: '4px', top: connected ? '4px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          Ping {ping} ms
          </div>
      </div>
    );
  }
}