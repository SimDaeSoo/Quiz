import { Button } from 'antd';
import { ROOM_STATE } from '../utils';
export default class OwnerUI extends React.Component {
    testCommand = () => {
        const { ownerCommand } = this.props;
        ownerCommand({
            type: 'start'
        });
    }
    render() {
        const { room } = this.props;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {
                    room && room.state === ROOM_STATE.READY &&
                    <Button onClick={this.testCommand} style={{ position: 'absolute', left: 'calc(50% - 100px)', top: 'calc(50% - 16px)', width: '200px' }} type='primary'>Quiz Start</Button>
                }
                {
                    room && room.state === ROOM_STATE.STARTED &&
                    <Button onClick={() => { }} style={{ position: 'absolute', left: 'calc(50% - 150px)', top: '62px', width: '300px' }} type='danger'>Next Question</Button>
                }
            </div>
        );
    }
}