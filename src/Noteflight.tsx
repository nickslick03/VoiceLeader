import { onMount, Setter } from "solid-js";

let scoreCount = 1;

const Noteflight = (props: {
    setScoreView: Setter<ScoreView | undefined>,
}) => {
    onMount(() => {
        NFClient.init();
        props.setScoreView(new NFClient.ScoreView('score' + scoreCount, 'fcfd6d0bc0770f67cdbe1b8129456521fec090a0', {}));
        scoreCount ++;
    });
    return (
        <div id={"score" + scoreCount}></div>
    );
};

export default Noteflight;