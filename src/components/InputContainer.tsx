import ChordsContainer from "./ChordsContainer";

const InputContainer = () => {

    return (
        <div class="py-3 flex flex-col gap-5">
            <div class="text-lg text-center">
                To change the key signature and mode, go to 
                <br />
                <span class="text-orange-600 font-bold">Palettes </span>
                &gt; Measure &gt; Change Key Signature.
            </div>
            <div class="text-center">
                Chords:
                <ChordsContainer />
            </div>
        </div>
    );
};

export default InputContainer;