
import Head from '../components/head';
import GameClient from '../classes/client';
import LoginCard from '../components/loginCard';
import CreateRoomCard from '../components/createRoomCard';
import { message, Button } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import SelectRoomCard from '../components/selectRoomCard';

const STATE = {
  LOGIN: 1,
  CREATE_ROOM: 2,
  SELECT_ROOM: 3,
  JOIN_ROOM: 4
};
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', character: '1', token: '', connected: false, ping: 0, mainState: STATE.LOGIN };
  }

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    const { SOCKET_ADDRESS } = this.props;
    this.client = new GameClient();
    this.client.setMainElements(this.refs.main);
    this.client.setStateCallback((state) => { this.setState(state); });
    await this.client.cetrification();
    this.client.connect(`${SOCKET_ADDRESS}`);
  }

  join = () => {
    const { name, character } = this.state;

    if (name && character) {
      const mainState = STATE.SELECT_ROOM;
      this.setState({ mainState });
    } else {
      message.error('Please Insert Your Name.');
    }
  }

  joinRoom = (roomID) => {
    const { name, character } = this.state;
    if (roomID !== undefined) {
      const mainState = STATE.JOIN_ROOM;
      this.client.setPlayer(name, character);
      this.client.joinRoom(roomID);
      this.setState({ mainState });
    }
  }

  create = () => {
    const { name, character } = this.state;

    if (name && character) {
      this.client.setPlayer(name, character);
      const mainState = STATE.CREATE_ROOM;
      this.setState({ mainState });
    } else {
      message.error('Please Insert Your Name');
    }
  }

  createRoom = (quizID, title) => {
    if (quizID && title) {
      this.client.applyCreateRoom(quizID, title);
    } else {
      message.error('Please Select Quiz Process And Insert Title');
    }
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

  zoomUp = () => {
    this.client.zoomUp();
  }

  zoomDown = () => {
    this.client.zoomDown();
  }

  render() {
    const { SOCKET_ADDRESS } = this.props;
    const { connected, ping, token, mainState, fps, ups } = this.state;
    return (
      <div ref='main' className="main">
        <Head />
        <div style={{ fontSize: '0.7em', zIndex: 1, position: 'fixed', left: '4px', top: connected ? '4px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          Ping {ping} ms
        </div>
        <div style={{ fontSize: '0.7em', zIndex: 2, position: 'fixed', left: '4px', top: fps ? '24px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: 'deepskyblue', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          {fps} FPS
        </div>
        <div style={{ fontSize: '0.7em', zIndex: 3, position: 'fixed', left: '4px', top: ups ? '44px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: 'coral', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          {ups} UPS
        </div>
        <div style={{ position: 'fixed', zIndex: 4, right: '4px', bottom: '5px', height: '22px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'background-color 0.3s' }}>
          <ApiOutlined /> {connected ? 'Connected' : 'Disconnected'}
        </div>

        {
          mainState === STATE.LOGIN &&
          <LoginCard join={this.join} setName={this.setName} setCharacter={this.setCharacter} create={this.create} token={token} connected={connected} />
        }
        {
          mainState === STATE.SELECT_ROOM &&
          <SelectRoomCard token={token} SOCKET_ADDRESS={SOCKET_ADDRESS} joinRoom={this.joinRoom} />
        }
        {
          mainState === STATE.CREATE_ROOM &&
          <CreateRoomCard token={token} createRoom={this.createRoom} />
        }
        {
          mainState === STATE.JOIN_ROOM &&
          <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 5 }}>
            <Button type='primary' style={{ margin: '2px' }} onClick={this.zoomUp}>+</Button>
            <Button type='primary' style={{ margin: '2px' }} onClick={this.zoomDown}>-</Button>
          </div>
        }
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  return { props: { SOCKET_ADDRESS: process.env.SOCKET_ADDRESS } };
} 