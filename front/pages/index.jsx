
import Head from '../components/head';
import GameClient from '../classes/client';
import LoginCard from '../components/loginCard';
import CreateRoomCard from '../components/createRoomCard';
import { message, Button, Progress, Input } from 'antd';
import { ApiOutlined, UserOutlined, ClockCircleOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import SelectRoomCard from '../components/selectRoomCard';
import OwnerUI from '../components/ownerUI';
import UserUI from '../components/rankUI';

const STATE = {
  LOGIN: 1,
  CREATE_ROOM: 2,
  SELECT_ROOM: 3,
  JOIN_ROOM: 4
};
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', character: '', token: '', chatText: '', connected: false, ping: 0, mainState: STATE.LOGIN, isOwner: false, userCount: 0, room: {}, ownerCommand: undefined, users: [], my: undefined, time: 0, showChat: false };
  }

  componentDidMount() {
    this.initialize();
    window.removeEventListener('keydown', this.keyEvent);
    window.addEventListener('keydown', this.keyEvent);
  }

  keyEvent = (e) => {
    const { keyCode } = e;
    switch (keyCode) {
      case 13:
        this.toggleChatting();
        break;
    }
  }

  toggleChatting = () => {
    const { showChat, chatText } = this.state;
    this.setState({ showChat: !showChat });

    if (!showChat) {
      if (this.chatInput && this.chatInput.focus) {
        this.chatInput.focus();
      }
    } else {
      if (chatText.length > 0) {
        this.client.socket.emit('chat', chatText);
      }
      this.setState({ chatText: '' });
    }
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

  zoomUp = () => {
    this.client.zoomUp();
  }

  zoomDown = () => {
    this.client.zoomDown();
  }

  zeroFill(value) {
    return value.toLocaleString('en', { minimumIntegerDigits: 3, useGrouping: false })
  }

  changeChat = (e) => {
    const chatText = e.target.value;
    this.setState({ chatText });
  }

  render() {
    const { SOCKET_ADDRESS } = this.props;
    const { connected, ping, token, mainState, fps, ups, isOwner, userCount, chatText, room, ownerCommand, users, my, time, character, name, showChat } = this.state;
    return (
      <div ref='main' className="main">
        <Head />
        <div style={{ fontSize: '0.7em', zIndex: 2, position: 'fixed', left: '4px', top: connected ? '4px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          Ping {ping} ms
        </div>
        <div style={{ fontSize: '0.7em', zIndex: 3, position: 'fixed', left: '4px', top: fps ? '24px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: 'deepskyblue', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          {fps} FPS
        </div>
        <div style={{ fontSize: '0.7em', zIndex: 4, position: 'fixed', left: '4px', top: ups ? '44px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: 'coral', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'top 0.3s' }}>
          {ups} UPS
        </div>
        <div style={{ fontSize: '0.7em', zIndex: 7, position: 'fixed', left: '4px', bottom: userCount ? '4px' : '-30px', height: '16px', borderRadius: '6px', backgroundColor: 'coral', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'bottom 0.3s' }}>
          <UserOutlined /> {this.zeroFill(userCount)}
        </div>
        <div style={{ position: 'fixed', zIndex: 5, right: '4px', bottom: '5px', height: '22px', borderRadius: '6px', backgroundColor: connected ? 'yellowgreen' : '#ff4d4f', color: 'white', textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px', paddingLeft: '6px', paddingRight: '6px', transition: 'background-color 0.3s' }}>
          <ApiOutlined /> {connected ? 'Connected' : 'Disconnected'}
        </div>

        {
          isOwner &&
          <OwnerUI users={users} userCount={userCount} room={room} ownerCommand={ownerCommand} />
        }
        {
          mainState === STATE.LOGIN &&
          <LoginCard join={this.join} setName={this.setName} create={this.create} token={token} connected={connected} name={name} character={character} />
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
          <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 6 }}>
            <Button type='primary' style={{ margin: '2px' }} onClick={this.zoomUp}>+</Button>
            <Button type='primary' style={{ margin: '2px' }} onClick={this.zoomDown}>-</Button>
          </div>
        }
        {
          mainState === STATE.JOIN_ROOM &&
          <UserUI users={users} my={my}></UserUI>
        }

        {
          mainState === STATE.JOIN_ROOM && showChat &&
          <div style={{ width: '100%', position: 'absolute', textAlign: 'right', bottom: '26px' }}>
            <Input addonAfter={<SendOutlined />} addonBefore={<div>{my ? my.name : ''}<MessageOutlined style={{ marginLeft: '4px' }} /></div>} ref={(input) => { this.chatInput = input; }} style={{ width: 'calc(100% - 240px)', margin: '10px' }} value={chatText} onChange={this.changeChat}></Input>
          </div>
        }

        {
          mainState === STATE.JOIN_ROOM &&
          <div style={{ position: 'fixed', top: '90px', left: 'calc(50% - 90px)', zIndex: 8, width: '180px', opacity: (time && time > 0) ? 1 : 0, transition: '1s opacity' }}>
            <Progress percent={time ? time * 10 : 0} strokeColor="#1890ff" status="active" showInfo={false} />
            <div style={{ width: '22px', height: '22px', borderRadius: '11px', paddingLeft: '4px', position: 'absolute', left: 0, backgroundColor: 'lightskyblue', color: 'white', top: '1px', boxShadow: 'rgba(0, 0, 0, 0.3) 0px 3px 3px 0px' }}>
              <ClockCircleOutlined />
            </div>
          </div>
        }
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  return { props: { SOCKET_ADDRESS: process.env.SOCKET_ADDRESS } };
} 