import { createSignal } from 'solid-js';
import Noteflight from './Noteflight';

const App = () => {
  const [getScoreView, setScoreView] = createSignal<ScoreView>();
  return (
    <>
      <h1>Voice Leader</h1>
      <Noteflight setScoreView={setScoreView}/>
    </>
  );
};

export default App;
