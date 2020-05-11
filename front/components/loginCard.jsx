import { Card, Input, Button, Tag, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default class LoginCard extends React.Component {
    render() {
        const { generate, setName, setCharacter } = this.props;
        return (
            <Card
                style={{ margin: 'auto', width: '300px', boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)', display: 'inline-block' }}
                cover={<img
                    alt="logo"
                    src="/logo.jpeg"
                />}
                actions={[
                    <div style={{ textAlign: 'center' }} key='join' onClick={generate}>
                        <Button size="large" type="primary">Join Quiz Event</Button>
                    </div>
                ]}
            >
                <Card.Meta
                    description={
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <Tag color="volcano">Select Your Character</Tag>
                            </div>

                            <Radio.Group defaultValue="1" style={{ marginTop: '2px' }} onChange={setCharacter} >
                                <div>
                                    <Radio.Button value="1" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/pinkfong.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                    <Radio.Button value="2" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/hogi.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                    <Radio.Button value="3" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/jenny.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                    <Radio.Button value="4" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/pokky.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="5" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/lyra.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                    <Radio.Button value="6" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/codi.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>
                                    <Radio.Button value="7" style={{ width: "58.5px", height: '58.5px', padding: 0, margin: '2px', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                        <div style={{ width: '100%', height: '100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundImage: `url("/laychel.jpg")`, backgroundSize: 'cover' }}>
                                        </div >
                                    </Radio.Button>

                                    <Input placeholder="닉네임을 입력해 주세요!." allowClear prefix={<UserOutlined style={{ marginRight: '4px' }} />} style={{ marginTop: '10px' }} onChange={setName} />
                                </div>
                            </Radio.Group>
                        </div>
                    }
                />
                <div style={{ position: 'absolute', top: '0', left: '0' }}>
                    <Tag color="magenta" style={{ margin: "2px" }}>Smart Study</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>Quiz</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>Game</Tag>
                </div>
            </Card>
        );
    }
}