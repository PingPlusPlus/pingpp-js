import React from 'react';
import { createRoot } from 'react-dom/client';
import pingpp from 'pingpp-js';

import { runPaymentChecks } from './checks.js';

function App() {
  const [results, setResults] = React.useState([]);
  return React.createElement('main', null,
    React.createElement('h1', null, 'Ping++ React npm integration'),
    React.createElement('button', { onClick: () => setResults(runPaymentChecks(pingpp)) }, 'Run payment checks'),
    React.createElement('pre', { id: 'results' }, JSON.stringify(results, null, 2)));
}
createRoot(document.getElementById('root')).render(React.createElement(App));
