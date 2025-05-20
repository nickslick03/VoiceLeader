import Noteflight from './Noteflight';
import InputContainer from './InputContainer';
import GraderSidebar from './GraderSidebar';
import { useScoreview } from './ScoreviewProvider';
import PresetChords from './PresetChords';

const App = () => {

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
      <Noteflight setScoreView={useScoreview()[1]}/>
      <InputContainer />
      <GraderSidebar />
      <PresetChords />
    </>
  );
};

export default App;
