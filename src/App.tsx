import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [greetMsg, setGreetMsg] = useState('');

  async function greet(name: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Hello World</h1>
      <Button onClick={greet.bind(null, 'World')}>Greet</Button>
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
