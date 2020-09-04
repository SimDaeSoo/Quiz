import { Button, Avatar } from 'antd';
import { ROOM_STATE } from '../utils';

const thumbnail = {
    1: 'pinkfong.jpg',
    2: 'hogi.jpg',
    3: 'jenny.jpg',
    4: 'pokky.jpg',
    5: 'lyra.jpg',
    6: 'codi.jpg',
    7: 'laychel.jpg',
};

export default class OwnerUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showRank: false };
    }
    start = () => {
        const { ownerCommand } = this.props;
        ownerCommand({
            type: 'start'
        });
    }

    nextQuestion = () => {
        const { ownerCommand } = this.props;
        ownerCommand({
            type: 'next'
        });
    }

    showRank = () => {
        console.log(this.props.users);
        this.setState({ showRank: true });
    }

    closeRank = () => {
        this.setState({ showRank: false });
    }

    quit = () => {
        const { ownerCommand } = this.props;
        ownerCommand({
            type: 'quit'
        });
    }

    get allUserRankElements() {
        const { users } = this.props;
        if (users) {
            return users.map((user, index) => {
                let rank = 1;
                users.forEach((compareUser) => {
                    if (compareUser.score > user.score) {
                        rank++;
                    }
                });

                const isCustomCharacter = Number.isNaN(Number(user.character));

                return (
                    <div key={index} style={{ width: 'calc(100% - 4px)', padding: '4px', backgroundColor: 'coral', color: 'white', fontSize: '1em', margin: '2px', display: 'flex' }}>
                        <Avatar src={isCustomCharacter ? user.character : `/${thumbnail[user.character]}`} size="small" style={{ marginRight: '4px' }} />
                        <div style={{ paddingTop: '1px', textShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                            No.{rank} {user.name} [{user.score} 점]
                        </div>
                    </div>
                );
            });
        }
    }

    render() {
        const { showRank } = this.state;
        const { room } = this.props;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                {
                    room && room.state === ROOM_STATE.READY &&
                    <Button onClick={this.start} style={{ position: 'absolute', left: 'calc(50% - 100px)', top: 'calc(50% - 16px)', width: '200px' }} type='primary'>Quiz Start</Button>
                }
                {
                    room && room.state === ROOM_STATE.READY_NEXT_QUESTION &&
                    <Button onClick={this.nextQuestion} style={{ position: 'absolute', left: 'calc(50% - 50px)', bottom: '62px', width: '100px' }} type='danger'>Next</Button>
                }
                {
                    room && room.state === ROOM_STATE.END_OF_QUESTION &&
                    <Button onClick={this.showRank} style={{ position: 'absolute', left: 'calc(50% - 100px)', top: 'calc(50% - 34px)', width: '200px' }} type='primary'>Show Ranking</Button>
                }
                {
                    room && room.state === ROOM_STATE.END_OF_QUESTION &&
                    <Button onClick={this.quit} style={{ position: 'absolute', left: 'calc(50% - 100px)', top: 'calc(50% + 2px)', width: '200px' }} type='danger'>Quit</Button>
                }
                {
                    showRank &&
                    <div style={{ position: 'absolute', overflow: 'auto', zIndex: 80, width: '300px', left: 'calc(50% - 150px)', maxHeight: 'calc(100% - 360px)', top: '130px', backgroundColor: 'darksalmon', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                        {this.allUserRankElements}
                        <Button onClick={this.closeRank} style={{ width: '100%' }} type='danger'>Close</Button>
                    </div>
                }
            </div>
        );
    }
}