import { Card, Button, Tag, Radio, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import fetch from 'isomorphic-unfetch';
import { ROOM_STATE } from '../utils';

export default class SelectRoomCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rooms: [], selectedRoom: -1 };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const { SOCKET_ADDRESS } = this.props;
        const response = await fetch(`${SOCKET_ADDRESS}/rooms`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const rooms = await response.json();
        this.setState({ rooms });
    }

    zeroFill(value) {
        return value.toLocaleString('en', { minimumIntegerDigits: 3, useGrouping: false })
    }

    get roomElements() {
        const { rooms } = this.state;

        if (rooms && rooms.length) {
            return rooms.map((room) => {
                return (
                    <div key={room.id} style={{ height: '34px', position: 'relative' }}>
                        <Radio.Button value={room.id} style={{ width: '100%', height: '100%', padding: 0 }} disabled={room.state !== ROOM_STATE.READY}>
                            <Tag color="red" style={{ marginLeft: '4px', marginRight: '2px' }}>#{this.zeroFill(Number(room.id) + 1)}</Tag>
                            <Tag color="blue"><UserOutlined style={{ marginRight: '4px' }} />{this.zeroFill(room.users)}</Tag>
                            {room.title.slice(0, 15)}
                        </Radio.Button>
                        {
                            room.state !== ROOM_STATE.READY &&
                            <div style={{ position: 'absolute', top: '6px', right: '6px', color: 'tomato' }}>
                                <LockOutlined />
                            </div>
                        }
                    </div>
                );
            })
        } else {
            return (
                <div style={{ height: '36px' }}>
                    <Radio.Button value="-1" style={{ width: '100%' }}>Empty Rooms...</Radio.Button>
                </div>
            );
        }
    }

    setSelectedRoom = (e) => {
        const selectedRoom = e.target.value;
        this.setState({ selectedRoom });
    }

    joinRoom = () => {
        const { joinRoom } = this.props;
        const { selectedRoom } = this.state;
        if (selectedRoom >= 0) {
            joinRoom(selectedRoom);
        } else {
            message.error('Please Select Room');
        }
    }

    render() {
        const { token } = this.props;
        return (
            <div style={{ paddingTop: '50px', paddingBottom: '50px', margin: 'auto', display: 'inline-block' }}>
                <Card
                    style={{ width: '300px', boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)' }}
                    cover={<img
                        height="171px"
                        alt="logo"
                        src="/logo.jpeg"
                    />}
                    actions={[
                        <div style={{ textAlign: 'center' }} key='join'>
                            <Button size="large" type="primary" style={{ width: '100px' }} onClick={this.joinRoom}>Join</Button>
                        </div>,
                        <div style={{ textAlign: 'center' }} key='refresh'>
                            <Button size="large" type="danger" style={{ width: '100px' }} onClick={this.fetchData}>Refresh</Button>
                        </div>
                    ]}
                >
                    <Card.Meta
                        description={
                            <div>
                                <div style={{ textAlign: 'center' }}>
                                    <Tag color="volcano">※ Select Room ※</Tag>
                                </div>
                                <Radio.Group onChange={this.setSelectedRoom} style={{ marginTop: '4px', width: '100%' }} >
                                    {this.roomElements}
                                </Radio.Group>
                            </div>
                        }
                    />
                    <div style={{ position: 'absolute', top: '144px', left: '0', width: '100%', textAlign: 'center' }}>
                        <Tag color="magenta" style={{ margin: "2px" }}>#SmartStudy</Tag>
                        <Tag color="magenta" style={{ margin: "2px" }}>#Quiz</Tag>
                        <Tag color="magenta" style={{ margin: "2px" }}>#Events</Tag>
                    </div>
                    <img style={{ position: 'absolute', top: '5px', left: '5%', width: "90%", backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', paddingTop: '5px', paddingBottom: '5px' }} src="./company_logo.png" />
                    <Tag color="gold" style={{ position: 'absolute', top: '-25px', right: '-2px', height: '20px', fontSize: '0.8em', margin: 0 }}>User ID / {token}</Tag>
                </Card>
            </div>
        );
    }
}