import Noteflight from './Noteflight';
import InputContainer from './InputContainer';
import GraderSidebar from './GraderSidebar';
import { useScoreview } from './ScoreviewProvider';
import PresetChords from './PresetChords';

const App = () => {

  return (
    <div class='flex flex-col min-h-screen'>
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
      <footer class='flex-1 flex items-end justify-center gap-4 [&>a]:text-indigo-800 [&>a]:underline py-2'>
        <a href='https://apcentral.collegeboard.org/media/pdf/ap24-sg-music-theory.pdf' target='_blank'>AP Scoring Guidelines</a>
        <a href='https://github.com/nickslick03/VoiceLeader'>Source Code</a>
        <a href='https://www.linkedin.com/in/nicholas-epps-597b94295/'>Nicholas Epps</a>
      </footer>
    </div>
  );
};

export default App;
