import { Card, Input, Button, Tag, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default class LoginCard extends React.Component {
    render() {
        const { join, setName, setCharacter, create, token, connected } = this.props;
        return (
            <Card
                style={{ margin: 'auto', width: '300px', boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)', display: 'inline-block' }}
                cover={<img
                    height="171px"
                    alt="logo"
                    src="/logo.jpeg"
                />}
                actions={[
                    <div style={{ textAlign: 'center' }} key='join' onClick={join}>
                        <Button size="large" type="primary" style={{ width: '100px' }} disabled={!connected}>Join</Button>
                    </div>,
                    <div style={{ textAlign: 'center' }} key='create' onClick={create}>
                        <Button size="large" type="danger" style={{ width: '100px' }} disabled={!connected}>Create</Button>
                    </div>
                ]}
            >
                <Card.Meta
                    description={
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <Tag color="volcano">※ Select Your Character ※</Tag>
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

                                    <Input placeholder="Insert Your Name" allowClear prefix={<UserOutlined style={{ marginRight: '4px' }} />} style={{ marginTop: '10px' }} onChange={setName} />
                                </div>
                            </Radio.Group>
                        </div>
                    }
                />
                <div style={{ position: 'absolute', top: '144px', left: '0', width: '100%', textAlign: 'center' }}>
                    <Tag color="magenta" style={{ margin: "2px" }}>#SmartStudy</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>#YearEnd</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>#Quiz</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>#Events</Tag>
                </div>
                <img style={{ position: 'absolute', top: '5px', left: '5%', width: "90%", backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', paddingTop: '5px', paddingBottom: '5px' }} src="./company_logo.png" />
                <Tag color="gold" style={{ position: 'absolute', top: '-25px', right: '-2px', height: '20px', fontSize: '0.8em', margin: 0 }}>User Unique ID / {token}</Tag>
            </Card>
        );
    }
}