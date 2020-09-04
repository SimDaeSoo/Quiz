import Router from 'next/router';
import { Card, Input, Button, Tag } from 'antd';
import { UserOutlined, GoogleOutlined } from '@ant-design/icons';

export default class LoginCard extends React.Component {
    login = () => {
        Router.push('/connect/google');
    }

    render() {
        const { join, setName, create, token, connected, name, character } = this.props;
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
                        <Button size="large" type="primary" style={{ width: '100px' }} disabled={!character || !name || !connected}>Join</Button>
                    </div>,
                    <div style={{ textAlign: 'center' }} key='create' onClick={create}>
                        <Button size="large" type="danger" style={{ width: '100px' }} disabled={!character || !name || !connected}>Create</Button>
                    </div>
                ]}
            >
                <Card.Meta
                    description={
                        <div style={{ width: '100%' }}>
                            <div>
                                <Input disabled={!character} placeholder={!character ? 'Google login first' : "Insert Your Name"} allowClear prefix={<UserOutlined style={{ marginRight: '4px' }} />} style={{ marginTop: '10px', marginBottom: '10px' }} onChange={setName} />
                            </div>
                            {
                                !character &&
                                <div style={{ width: '100%' }}>
                                    <Button type='primary' icon={<GoogleOutlined />} style={{ width: '100%' }} onClick={this.login}>Login with google</Button>
                                </div>
                            }
                            {
                                character &&
                                <div style={{ width: '100%' }}>
                                    <Button type='primary' icon={<GoogleOutlined />} style={{ width: '100%', backgroundColor: 'yellowgreen', color: 'white' }} disabled={true}>Already logined with google</Button>
                                </div>
                            }
                        </div>
                    }
                />
                <div style={{ position: 'absolute', top: '144px', left: '0', width: '100%', textAlign: 'center' }}>
                    <Tag color="magenta" style={{ margin: "2px" }}>#SmartStudy</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>#Quiz</Tag>
                    <Tag color="magenta" style={{ margin: "2px" }}>#Events</Tag>
                </div>
                <img style={{ position: 'absolute', top: '5px', left: '5%', width: "90%", padding: '10px' }} src="./company_logo.png" />
                <Tag color="gold" style={{ position: 'absolute', top: '-25px', right: '-2px', height: '20px', fontSize: '0.8em', margin: 0 }}>User ID / {token}</Tag>
            </Card>
        );
    }
}