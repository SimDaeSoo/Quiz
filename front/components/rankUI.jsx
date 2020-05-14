import { Avatar, Badge } from 'antd';

const thumbnail = {
    1: 'pinkfong.jpg',
    2: 'hogi.jpg',
    3: 'jenny.jpg',
    4: 'pokky.jpg',
    5: 'lyra.jpg',
    6: 'codi.jpg',
    7: 'laychel.jpg',
};

export default class RankUI extends React.Component {
    get topUserElements() {
        const { users } = this.props;
        const rankedElements = users.slice(0, 5).map((user, index) => {
            let rank = 1;
            users.forEach((compareUser) => {
                if (compareUser.score > user.score) {
                    rank++;
                }
            });
            return (
                <Badge key={index} count={user.score} showZero={true} style={{ fontSize: '0.7em' }} offset={[-6, 6]}>
                    <div style={{ width: '100px', height: '28px', padding: '2px', borderRadius: '14px', backgroundColor: 'dodgerblue', color: 'white', fontSize: '0.9em', display: 'flex', margin: '4px' }}>
                        <Avatar src={`/${thumbnail[user.character]}`} size="small" style={{ marginRight: '4px' }} />
                        <div style={{ paddingTop: '7px', textShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                            No.{rank} {user.name}
                        </div>
                    </div>
                </Badge>
            );
        });
        return rankedElements;
    }

    render() {
        const { my } = this.props;
        return (
            <div style={{ position: 'fixed', bottom: '22px', left: 0, width: '110px' }}>
                {
                    my &&
                    <Badge count={my.score} showZero={true} style={{ fontSize: '0.7em' }} offset={[-6, 6]}>
                        <div style={{ width: '100px', height: '28px', padding: '2px', borderRadius: '14px', backgroundColor: 'tomato', color: 'white', fontSize: '0.9em', display: 'flex', margin: '4px' }}>
                            <Avatar src={`/${thumbnail[my.character]}`} size="small" style={{ marginRight: '4px' }} />
                            <div style={{ paddingTop: '7px', textShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.3)' }}>
                                I'm {my.name}
                            </div>
                        </div>
                    </Badge>
                }
                {this.topUserElements}
            </div>
        );
    }
}