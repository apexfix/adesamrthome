import React, { Component, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorPage from '../../src/app/error';

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {}
  render() { return this.state.failed ? <ErrorPage /> : this.props.children; }
}
function FailingView() {
  const [fail, setFail] = useState(false);
  if (fail) throw new Error('Synthetic recovery fixture failure');
  return <button onClick={() => setFail(true)}>Trigger test error</button>;
}
createRoot(document.getElementById('fixture-root')).render(<Boundary><FailingView /></Boundary>);
