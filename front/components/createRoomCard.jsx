import { Card, Button, Tag, Select, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import fetch from 'isomorphic-unfetch';

export default class CreateRoomCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { quizzes: [], selectedQuizID: '', title: '' };
    }
    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const response = await fetch(`/api/preview`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const quizzes = await response.json();
        this.setState({ quizzes });
    }

    get quizElements() {
        const { quizzes } = this.state;
        if (quizzes && quizzes.length > 0) {
            return quizzes.map((quiz) => {
                return (<Select.Option value={quiz.id} key={quiz.id}>{quiz.title}</Select.Option>);
            })
        } else {
            return [];
        }
    }

    setTitle = (e) => {
        const title = e.target.value;
        this.setState({ title });
    }

    setQuiz = (selectedQuizID) => {
        this.setState({ selectedQuizID });
    }

    render() {
        const { selectedQuizID, title } = this.state;
        const { token, createRoom } = this.props;
        return (
            <Card
                style={{ margin: 'auto', width: '300px', boxShadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.3)', display: 'inline-block' }}
                cover={<img
                    height="171px"
                    alt="logo"
                    src="/logo.jpeg"
                />}
                actions={[
                    <div style={{ textAlign: 'center' }} key='create' onClick={() => { createRoom(selectedQuizID, title); }}>
                        <Button size="large" type="danger" style={{ width: '200px' }}>Create</Button>
                    </div>
                ]}
            >
                <Card.Meta
                    description={
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <Tag color="volcano">※ Select Quiz ※</Tag>
                            </div>
                            <Input placeholder="Insert Room Name" allowClear prefix={<EditOutlined style={{ marginRight: '4px' }} />} style={{ marginTop: '10px' }} onChange={this.setTitle} style={{ marginTop: '4px' }} />
                            <Select style={{ width: '100%', marginTop: '4px' }} onChange={this.setQuiz} placeholder='Select Quiz Process'>
                                {this.quizElements}
                            </Select>
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
                <Tag color="gold" style={{ position: 'absolute', top: '-25px', right: '-2px', height: '20px', fontSize: '0.8em', margin: 0 }}>User ID / {token}</Tag>
            </Card>
        );
    }
}