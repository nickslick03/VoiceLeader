import { createSignal } from 'solid-js';
import Noteflight from './Noteflight';
import InputContainer from './InputContainer';

const App = () => {

  const [getScoreView, setScoreView] = createSignal<ScoreView>();
  
  return (
    <>
      <h1 class="text-center text-4xl font-bold my-8">
        Voice Leader
      </h1>
      {/*<Noteflight setScoreView={setScoreView}/>*/}
      <div class="w-screen h-96 bg-slate-300"></div>
      <InputContainer />
    </>
  );
};

export default App;
