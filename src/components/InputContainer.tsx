import ChordsContainer from "./ChordsContainer";

const InputContainer = () => {

    return (
        <div class="flex flex-col gap-5">
            <div class="flex justify-center gap-5">
                <span>Mode: </span>
                <label>
                    <input type="radio" name="mode" id="major" /> 
                    &nbsp;Major
                </label>
                <label>
                    <input type="radio" name="mode" id="minor" /> 
                    &nbsp;Minor
                </label>
            </div>
            <div>
                <div class="text-center">
                    Chords: 
                </div>
                <ChordsContainer />
            </div>
        </div>
    );
};

export default InputContainer;