import { JSX, Signal, createContext, createSignal, useContext } from "solid-js";

const scoreviewContext = createContext();

export function ScoreviewProvider(props: {
  children: JSX.Element
}) {

  const scoreviewSignal = createSignal<ScoreView>();

  return (
    <scoreviewContext.Provider value={scoreviewSignal}>
        {props.children}
    </scoreviewContext.Provider>
  );
}

export function useScoreview() { return useContext(scoreviewContext) as Signal<ScoreView | undefined>}