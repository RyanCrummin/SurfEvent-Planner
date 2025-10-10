import React from 'react';
import CreateEvent from './CreateEvent';

function App() {
  const adminPassword = 'surfadmin2025';
  const entered = prompt('Enter admin password');

  if (entered !== adminPassword) return <h1 style={{ textAlign: 'center', marginTop: 100 }}>Access Denied</h1>;

  return <CreateEvent />;
}

export default App;
