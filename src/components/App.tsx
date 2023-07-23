import Noteflight from './Noteflight';
import InputContainer from './InputContainer';
import GraderSidebar from './GraderSidebar';
import { useScoreview } from './ScoreviewProvider';
import { createSignal } from 'solid-js';

const App = () => {

  const [isKeyMajor, setIsKeyMajor] = createSignal(true);
  
  return (
    <>
      <hgroup class="text-center my-8 flex flex-col items-center gap-4">
        <h1 class="text-4xl font-bold pb-4 border-b-2">
          Voice Leader
        </h1>
        <p>
          Grader for AP Music Theory Question 6
        </p>
      </hgroup>
      {<Noteflight setScoreView={useScoreview()[1]}/>}
      {/*<div class="w-screen h-96 bg-slate-300"></div>*/}
      <InputContainer />
      <GraderSidebar isKeyMajor={isKeyMajor} />
    </>
  );
};

export default App;
