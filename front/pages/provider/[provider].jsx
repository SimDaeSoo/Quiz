import React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

class Provider extends React.Component {
  componentDidMount() {
    this.veryfing();
  }

  veryfing = async () => {
    const { provider, access_token, id_token } = this.props;
    const token = localStorage.IDENTIFY_TOKEN;

    try {
      const response = await fetch(`/auth/${provider}/callback?access_token=${access_token}&id_token=${id_token}`, { method: 'get', headers: { 'Content-Type': 'application/json' } });
      const { user } = await response.json();
      const update = await fetch(`/api/token/picture`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picture: user.picture, token })
      });
      Router.push('/');
    } catch (e) {
      Router.push('/');
    }
  }

  render() {
    return (<></>);
  }
}

export async function getServerSideProps(context) {
  const { provider, access_token } = context.query || {};
  const id_token = context.query['raw[id_token]'];

  return { props: { provider, access_token, id_token } };
}

export default Provider;