import Head from '../components/head';
import GameClient from '../classes/client';

export default class Home extends React.Component {
  componentDidMount() {
    const client = new GameClient();
    client.connect('http://0.0.0.0:3030');
  }

  render() {
    return (
      <div>
        <Head title="Home" />
        Hello World
      </div>
    );
  }
}