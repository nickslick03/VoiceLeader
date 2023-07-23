/* @refresh reload */
import { render } from 'solid-js/web';

import App from './components/App';
import { ChordsProvider } from './components/ChordsProvider';
import { ScoreviewProvider } from './components/ScoreviewProvider';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  );
}

render(() => 
  <ChordsProvider>
    <ScoreviewProvider>
      <App />
    </ScoreviewProvider>
  </ChordsProvider>
  , root!);
