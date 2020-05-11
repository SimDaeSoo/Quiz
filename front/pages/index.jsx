
import Head from '../components/head';
import GameClient from '../classes/client';
import GameRenderer from '../classes/renderer';
import LoginCard from '../components/loginCard';
import { message } from 'antd';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialize: false, name: '', character: 1 };
  }

  generate = () => {
    const { name, character } = this.state;

    if (name) {
      this.client = new GameClient();
      this.client.setName(name);
      this.client.setCharacter(character);
      this.client.connect('http://0.0.0.0:3333');

      this.renderer = new GameRenderer();
      this.renderer.initialize({ el: this.refs.main });

      this.client.setRenderer(this.renderer);
      const initialize = true;
      this.setState({ initialize });
    } else {
      message.error('Please Insert Your Name.');
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

  setCharacter = (e) => {
    const character = e.target.value;
    this.setState({ character });
  }

  render() {
    const { initialize } = this.state;
    return (
      <div ref='main' className="main">
        <Head />
        {
          !initialize &&
          <LoginCard generate={this.generate} setName={this.setName} setCharacter={this.setCharacter} />
        }
      </div>
    );
  }
}