import React from 'react';
import CreateEvent from './src/CreateEvent';

function App() {
  // Hidden admin check: simple password prompt
  const adminPassword = 'surfadmin2025'; // Change to something secure
  const entered = prompt('Enter admin password');

  if (entered !== adminPassword) {
    return <h1>Access Denied</h1>;
  }

  return <CreateEvent />;
}

export default App;
