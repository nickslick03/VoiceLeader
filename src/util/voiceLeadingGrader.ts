import { C_SCALE, INTERVALS, NOTE_LETTERS, VOICE_PARTS } from "./consts";
import { noteToMidiIndex, realizeChord, scaleDegreeToInterval, secondaryNumeralToNumeral } from "./converters";
import { feedbackTransformers } from "./feedbackTransformers";
import { Chord, Feedback, Result, Interval, Outline, VoiceLead, MIDIPitch } from "./types";

const voiceLeadingOutlinesWith2DArrays: Record<string, Outline<"2DArray">> = {
    'findUncharacteristicUnequalFifths': {
        correctMessage: 'No uncharacteristic unequal fifths',
        errorMessage: 'There are uncharacteristic unequal fifths in the:',
        col1: VOICE_PARTS,
        col2: VOICE_PARTS,
        points: 1,
        seperator: ' to ',
        criterion: {
            numeral: 'II',
            letter: 'C',
            number: [1]
        }
    },
    'findOverlappingVoices': {
        correctMessage: 'No overlapping voices',
        errorMessage: 'The following voices are overlapping:',
        col1: VOICE_PARTS,
        col2: VOICE_PARTS,
        points: 1,
        seperator: ' to ',
        criterion: {
            numeral: 'II',
            letter: 'C',
            number: [3]
        }
    },
    'findParallelUnisons': {
        correctMessage: 'No parallel unisons',
        errorMessage: 'There are parallel unisons between the following voices:',
        col1: VOICE_PARTS,
        col2: VOICE_PARTS,
        points: 2,
        seperator: ' to ',
        criterion: {
            numeral: 'II',
            letter: 'D',
            number: [1]
        }
    },
    'findParallelFifths': {
        correctMessage: 'No parallel fifths',
        errorMessage: 'There are parallel fifths between the following voices:',
        col1: VOICE_PARTS,
        col2: VOICE_PARTS,
        points: 2,
        seperator: ' to ',
        criterion: {
            numeral: 'II',
            letter: 'D',
            number: [1]
        }
    },
    'findParallelOctaves': {
        correctMessage: 'No parallel octaves',
        errorMessage: 'There are parallel octaves between the following voices:',
        col1: VOICE_PARTS,
        col2: VOICE_PARTS,
        points: 2,
        seperator: ' to ',
        criterion: {
            numeral: 'II',
            letter: 'D',
            number: [1]
        }
    },
    'findUncharacteristicLeaps': {
        correctMessage: 'No uncharacteristic leaps',
        errorMessage: 'There are uncharacteristic leaps in the following voices',
        col1: VOICE_PARTS,
        col2: ["augmented second", "tritone", "more than a fifth"],
        points: 2,
        seperator: ' - ',
        criterion: {
            numeral: 'II',
            letter: 'D',
            number: [2]
        }
    }
}

const voiceLeadingOutlinesWithBooleans: Record<string, Outline> = {
    'isNotHiddenFifth': {
        correctMessage: 'No hidden fifth in the outer parts',
        errorMessage: 'There is a hidden fifth in the outer parts',
        points: 1,
        criterion: {
            numeral: 'II',
            letter: 'C',
            number: [2]
        }
    },
    'isNotHiddenOctave': {
        correctMessage: 'No hidden octave in the outer parts',
        errorMessage: 'There is a hidden octave in the outer parts',
        points: 1,
        criterion: {
            numeral: 'II',
            letter: 'C',
            number: [2]
        }
    },
};

const voiceLeadingOutlinesWithArrays: Record<string, Outline<'Array'>> = {
    'findIncorrectApproachToChordalSeventh': {
        correctMessage: 'The chordal seventh was apporached correctly',
        errorMessage: 'The chordal seventh in the following part was not approached correctly (by a descending leap of a fourth or larger):',
        array: VOICE_PARTS,
        points: 1,
        criterion: {
            numeral: 'II',
            letter: 'C',
            number: [4]
        }
    },
}

/**
 * Checks if any upper voices between two chords move by leap (or skip). (II. Voice Leading, B)
 * @param chord1Letters An array of the chord notes from bass to soprano.
 * @param chord2Letters An array of the chord notes from bass to soprano.
 * @returns array of indices representing the voices in which movement by leap (or skip) is made in the upper voices. 1 is tenor, 2 is alto, and 3 is soprano. Empty if there are no movements by leap (or skip).

 */
export function findLeaps(chord1Letters: string[], chord2Letters: string[]) {
    const result: number [] = [];
    for (let i = 1; i <= 3; i++)
        if (Math.abs(NOTE_LETTERS.indexOf(chord1Letters[i]) - NOTE_LETTERS.indexOf(chord2Letters[i])) > 2
            && !(chord1Letters[i] == 'G' && chord2Letters[i] == 'A' || chord1Letters[i] == 'A' && chord2Letters[i] == 'G'))
            result.push(i);
    return result;
}

/**
 *
 * @param scaleDegrees1 The scale degrees of chord 1
 * @param chordIndices1 The MIDI indicies of chord 1
 * @param scaleDegrees2 The scale degrees of chord 2
 * @param chordIndices2 The MIDI indicies of chord 2
 */
export function findLeaps2(scaleDegrees1: number[], chordIndices1: number[], scaleDegrees2: number[], chordIndices2: number[]) {
    const result: number[] = [];
    for (let i = 1; i <= 3; i++) {
        const isLeap = Math.abs(scaleDegrees1[i] - scaleDegrees2[i]) % 6 > 1 // more than 1 scale degree apart
            || Math.abs(chordIndices1[i] - chordIndices2[i]) > 3; // more than a distance of a augmented second apart (just in case the scale degrees are close but is in a different octave)
        if (isLeap)
            result.push(i);
    }
    return result;
}

/**
 * Caculates the interval between two notes.
 * @param lowNotePitch The lower note as a MIDI index
 * @param highNotePitch The higher note as a MIDI index
 * @returns an interval object the fields `isAscending`, `octaves`, and the `interval` string.
 */
export function getInterval(lowNotePitch: MIDIPitch, highNotePitch: MIDIPitch) {
    return {
        octaves: Math.floor((highNotePitch - lowNotePitch) / 12),
        interval: INTERVALS[(highNotePitch - lowNotePitch) % 12]
    };
}

/*
 * Unequal fifths (d5→P5)• In a three- or four-part texture, 
 * a rising d5→P5 is acceptable ONLY in the progressionsI V$ I6 and I vii°6 I6 (no deduction).
 *  • A rising d5→P5 in other progressions is unacceptable (1 point error).
 *  • The reverse, a rising P5→d5, is acceptable voice leading (no deduction).
 *  • Unequal fifths in either order, when descending, are acceptable (no deduction).
 *  - Any d5→ P5 (ascending or descending) between the bass and an upper voice is unacceptable(award 1 point only).
 */
 
/**
 * Checks if there is unacceptable unequal fifths in the upper voices (II. Voice Leading, C-1)
 * @param chord1Pitches An array of the chord notes in MIDI indices from bass to soprano.
 * @param chord2Pitches An array of the chord notes in MIDI indices from bass to soprano.
 * @returns an array of the indices of the voice parts where uncharacteristic unequal fifths were found. If empty, no unequal fifths were found.
 */
export function findUncharacteristicUnequalFifths(chord1Pitches: MIDIPitch[], chord2Pitches: MIDIPitch[], secondChord: Chord) {
    const results: [number, number][] = [];

    const bassIntervals1 = chord1Pitches.slice(1).map(note => getInterval(chord1Pitches[0], note));
    const bassIntervals2 = chord2Pitches.slice(1).map(note => getInterval(chord2Pitches[0], note));
    
    bassIntervals1.forEach((interval, i) => {
        if (interval.interval === 'd5' && bassIntervals2[0].interval === 'P5')
            results.push([0, i + 1]);
    });

    const upperIntervalIndicies: [number, number][] = [
        [1, 2],
        [1, 3],
        [2, 3]
    ];

    const upperIntervals1 = [
        getInterval(chord1Pitches[1], chord1Pitches[2]), // tenor to alto
        getInterval(chord1Pitches[1], chord1Pitches[3]), // tenor to soprano
        getInterval(chord1Pitches[2], chord1Pitches[3])  // alto to soprano
    ];

    const upperIntervals2 = [
        getInterval(chord2Pitches[1], chord2Pitches[2]), // tenor to alto
        getInterval(chord2Pitches[1], chord2Pitches[3]), // tenor to soprano
        getInterval(chord2Pitches[2], chord2Pitches[3])  // alto to soprano
    ];

    upperIntervals1.forEach((interval, i) => {
        const bottomNote1 = chord1Pitches[upperIntervalIndicies[i][0]];
        const topNote1 = chord1Pitches[upperIntervalIndicies[i][1]];
        const bottomNote2 = chord2Pitches[upperIntervalIndicies[i][0]];
        const topNote2 = chord2Pitches[upperIntervalIndicies[i][1]];
        if (interval.interval == 'd5' && upperIntervals2[i].interval == 'P5' // d5->P5
            && ((topNote1 % 12) < (topNote2 % 12) || (bottomNote1 % 12) < (bottomNote2 % 12)) // Rising d5->P5
            && !(secondChord.numeral == 1 && secondChord.inversion == 1)) // Not passing to I^6 (I in second inversion)
            results.push(upperIntervalIndicies[i]);
    });

    return results;
}

/*
HIDDEN FIFTHS / OCTAVES
 - similar motion
 - second interval fifth/octave
 - lower voice moves by step
*/

export function isNotHiddenInterval(outerVoices1: [MIDIPitch, MIDIPitch], outerVoices2: [MIDIPitch, MIDIPitch], interval: Interval) {
    const diff1 = outerVoices1[0] - outerVoices2[0];
    const diff2 = outerVoices1[1] - outerVoices2[1];
    const bassInterval = getInterval(outerVoices1[0], outerVoices2[0]).interval;
    return !(((diff1 > 0 && diff2 > 0) || (diff1 < 0 && diff2 < 0)) // similar motion
    && getInterval(outerVoices2[0], outerVoices2[1]).interval === interval
    && (bassInterval === 'm2' || bassInterval === 'M2'));
}

/**
 * Checks if two chords contain an unacceptable hidden fifth.
 * @param outerVoices1 the bass and soprano voices of the 1st chord represented in MIDI indices
 * @param outerVoices2 the bass and soprano voices of the 2nd chord represented in MIDI indices
 * @returns true if there's an unacceptable hidden fifth and false if there isn't.
 */
export function isNotHiddenFifth(outerVoices1: [MIDIPitch, MIDIPitch], outerVoices2: [MIDIPitch, MIDIPitch]) {
    return isNotHiddenInterval(outerVoices1, outerVoices2, 'P5');
}

/**
 * Checks if two chords contain an unacceptable hidden octave.
 * @param outerVoices1 the bass and soprano voices of the 1st chord represented in MIDI indices
 * @param outerVoices2 the bass and soprano voices of the 2nd chord represented in MIDI indices
 * @returns true if there's an unacceptable hidden octave and false if there isn't.
 */
export function isNotHiddenOctave(outerVoices1: [MIDIPitch, MIDIPitch], outerVoices2: [MIDIPitch, MIDIPitch]) {
    return isNotHiddenInterval(outerVoices1, outerVoices2, '0');
}

/**
 * checks if there is any overlapping voices between two chords.
 * @param chordPitches1 The MIDI indices of the first chord
 * @param chordPitches2 The MIDI indices of the second chord 
 * @returns an 2D array of voice parts where voices overlap. If empty, no voices overlap.
 */
export function findOverlappingVoices(chordPitches1: MIDIPitch[], chordPitches2: MIDIPitch[]) {
    const results: [number, number][] = [];
    for (let second = 0; second <= 3; second++) {
        for (let first = 0; first <= 3; first++) {
            if (first == second) continue;
            let note1 = chordPitches1[first];
            let note2 = chordPitches2[second];
            if ((second < first && note2 > note1) // lower note is higher than prev high note
                || (second > first && note2 < note1)) // higher note is lower than prev low note
                results.push([first, second]);
        }
    }
    return results;
}

/**
 * Checks if the chordal seventh of a chord is approached incorrectly, i.e. approached by a descending leap of a fourth or larger.
 * @param chord1Pitches An array of the chord notes in MIDI indices from bass to soprano
 * @param chord2Pitches An array of the chord notes in MIDI indices from bass to soprano
 * @param chordIntervals2 the chord intervals of the 2nd chord, from bass to soprano
 * @param chord2 chord2
 * @returns an empty array if the apporach was acceptable, and an array with the index of the voice part (0 for bass, 3 for soprano) if the apporach was unacceptable.
 */
export function findIncorrectApproachToChordalSeventh(
    chord1Pitches: MIDIPitch[], chord2Pitches: MIDIPitch[], chordIntervals2: number[], chord2: Chord, isKeyMajor: boolean) {

    if (!chord2.isSeventh) {
        return null;
    }

    const chordalSeventh = realizeChord(chord2, isKeyMajor)[3];
    
    const chordalSeventhIndex = chordIntervals2.findIndex(interval => interval === chordalSeventh);
    if (chordalSeventhIndex === -1 
        || chord1Pitches[chordalSeventhIndex] <= chord2Pitches[chordalSeventhIndex]) 
        return [];
    const { interval, octaves } = getInterval(chord2Pitches[chordalSeventhIndex], chord1Pitches[chordalSeventhIndex]);
    return (interval.length > 1 && +interval[1] >= 4) || octaves > 0 
        ? [chordalSeventhIndex] 
        : [];
}

function findParallelIntervals(
    searchInterval: Interval, 
    chordIndices1: number[], 
    chordIndices2: number[],
    minOctave = -Infinity,
    maxOctave = Infinity) {
    // get intervals of each voice part combo in both chords (low to high notes)
    // for each combo pair
        // if both intervals equal interval param
            // add voice indices to results array
    // return results array
    const results: [number, number][] = [];
    for (let i = 0; i <= 3; i++) {
        for (let j = i + 1; j <= 3; j++) {
            const intervals: ReturnType<typeof getInterval>[] = [];
            [chordIndices1, chordIndices2].forEach((chordIndices, k) => {
                const lowNote = Math.min(chordIndices[i], chordIndices[j]);
                const highNote = Math.max(chordIndices[i], chordIndices[j]);
                intervals[k] = getInterval(lowNote, highNote);
            });
            if (intervals.every(({ interval, octaves }) => 
                interval == searchInterval 
                && octaves >= minOctave 
                && octaves <= maxOctave))
                results.push([i, j]);
        }
    }
    return results;
}

/**
 * Finds any parallel fifths between two chords
 * @param chord1Pitches The MIDI indices of the first chord
 * @param chord2Pitches The MIDI indices of the second chord
 * @returns an array of the voice parts where parallel fifths exist (0 for bass, 3 for soprano). If empty, no parallel fifths exist.
 */
export function findParallelFifths(chord1Pitches: MIDIPitch[], chord2Pitches: MIDIPitch[]) {
    return findParallelIntervals("P5", chord1Pitches, chord2Pitches);
}

/**
 * Finds any parallel octaves between two chords
 * @param chord1Pitches The MIDI indices of the first chord
 * @param chord2Pitches The MIDI indices of the second chord
 * @returns an array of the voice parts where parallel octaves exist (0 for bass, 3 for soprano). If empty, no parallel octaves exist.
 */
export function findParallelOctaves(chord1Pitches: MIDIPitch[], chord2Pitches: MIDIPitch[]) {
    return findParallelIntervals("0", chord1Pitches, chord2Pitches, 1);
}

/**
 * Finds any parallel unisons between two chords.
 * @param chord1Pitches The MIDI indices of the first chord
 * @param chord2Pitches The MIDI indices of the second chord
 * @returns an array of the voice parts where parallel unisons exist (0 for bass, 3 for soprano). If empty, no parallel unisons exist.
 */
export function findParallelUnisons(chord1Pitches: MIDIPitch[], chord2Pitches: MIDIPitch[]) {
    return findParallelIntervals("0", chord1Pitches, chord2Pitches, 0, 0);
}

/**
 * @param chord1Pitches The MIDI indices of the first chord
 * @param scaleDegrees2 The scale degrees of the first chord (1-7)
 * @param chord2Pitches The MIDI indices of the second chord
 * @param scaleDegrees2 The scale degrees of the second chord (1-7)
 * @returns a 2D array where each array's first element is the index of the voice (0-4 -> bass-soprano) and the second element is the string of the type of uncharacteristic leap.
 */
export function findUncharacteristicLeaps(
    chord1Pitches: MIDIPitch[], scaleDegrees1: number[], chord2Pitches: MIDIPitch[], scaleDegrees2: number[]) {
        const results: [number, number][] = [];
        for (let i = 0; i <= 3; i++) {
            const [ lowNote, highNote ] = [chord1Pitches[i], chord2Pitches[i]].sort((a, b) => a - b);
            const interval = getInterval(lowNote, highNote).interval;
            if (interval === 'm3' && [1, -6].some(diff => diff === scaleDegrees2[i] - scaleDegrees1[i]))
                results.push([i, 0]);
            else if (interval === 'd5')
                results.push([i, 1]);
            else if (Math.abs(chord2Pitches[i] - chord1Pitches[i]) >= 8)
                results.push([i, 2]);
        }
        return results;
}

/**
 * @param scaleDegrees1 The scale degrees of the first chord (1-7)
 * @param scaleDegrees2 The scale degrees of the second chord (1-7)
 * @param chords An array of chord objects, where chords[1] is the 1st chord, chords[2] is the 2nd chord and chords[0] is the chord that came before 1 (it may be null if chords[1] was the first chord in the harmonization).
 * @returns an object with an error boolean and message string fields.
 */
export function findUnresolvedChordalSeventh(
    scaleDegrees1: number[], 
    scaleDegrees2: number[],
    chords: [Chord | null, Chord, Chord],
    isKeyMajor: boolean): Feedback | null {
    
    // is there a chordal seventh?
    if (!chords[1].isSeventh) {
        return null;
    }

    const criterion = {
        numeral: 'II',
        letter: 'D',
        number: [3]
    };

    const chordalSeventhDegree = (secondaryNumeralToNumeral(chords[1].numeral, chords[1].secondary) - 1) || 7;
    // find out the chordal seventh
    const chordalSeventhIndex = scaleDegrees1.findIndex((degree) => degree === chordalSeventhDegree);

    if (chordalSeventhIndex === -1) {
        return {
            pointsLost: 2,
            criterion,
            isCorrect: false,
            message: 'No chordal seventh defined'
        }
    }

    const movement = scaleDegrees1[chordalSeventhIndex] - scaleDegrees2[chordalSeventhIndex];
    if (movement === 1 || movement === 0 || movement == 6 /* 7 to 1 */ || (
        chords[0] !== null 
        && chords[0].numeral === 1 && chords[0].quality === 'minor' && chords[0].inversion === 0 // i
        && chords[1].numeral === 5 && chords[1].quality === 'majorMinor' && chords[1].inversion === 2 // V4/3
        && chords[2].numeral === 1 && chords[2].quality === 'minor' && chords[2].inversion === 1 // i6
    )) {
        return {
            criterion,
            pointsLost: 0,
            isCorrect: true,
            message: `Chordal seventh in the ${VOICE_PARTS[chordalSeventhIndex]} is resolved correctly`
        }
    } else {
        return {
            criterion,
            pointsLost: 2,
            isCorrect: false,
            message: `Chordal seventh in the ${VOICE_PARTS[chordalSeventhIndex]} is not resolved correctly`
        }
    }
}

/**
 * @param chordIntervals1 the intervals of the chord the user entered
 * @param chord1Pitches The MIDI indices of the first chord
 * @param scaleDegrees2 The scale degrees of the first chord (1-7)
 * @param chord2Pitches The MIDI indices of the second chord
 * @param scaleDegrees2 The scale degrees of the second chord (1-7)
 * @param chords An array of chord objects, where chords[1] is the 1st chord, chords[2] is the 2nd chord and chords[0] is the chord that came before 1 (it may be null if chords[1] was the first chord in the harmonization).
 */
export function findUnresolvedOuterLeadingTone(
    chordIntervals1: number[],
    chord1Pitches: MIDIPitch[], 
    scaleDegrees1: number[], 
    chord2Pitches: MIDIPitch[], 
    scaleDegrees2: number[], 
    chords: [Chord | null, Chord, Chord]): Feedback {

    const criterion = {
        numeral: 'II',
        letter: 'D',
        number: [4]
    }
    
    const outerSeventhIndexes = [0, 3]
        .filter(i => scaleDegrees1[i] === 7 && chordIntervals1[i] === 11);

    if (outerSeventhIndexes.length === 0) {
        return {
            pointsLost: 0,
            isCorrect: true,
            message: 'No leading tones in the outer voices',
            list: [],
            criterion
        }
    }

    const isOneFiveSixProg = // I and vi are connected by V, V7, or V6 (e.g., I–V7–vi)
    chords[0] != null
    && chords[0].numeral === 1 && chords[0].quality === 'major' && chords[0].inversion === 0
    && chords[1].numeral === 5 && (chords[1].inversion === 0 || (!chords[1].isSeventh && chords[1].inversion === 1))
    && chords[2].numeral === 6 && chords[2].quality === 'minor' && chords[2].inversion === 0;

    const incorrectLeadingTones = outerSeventhIndexes.filter(i =>
        !((scaleDegrees2[i] === 1 && chord2Pitches[i] - chord1Pitches[i] === 1)
        || (isOneFiveSixProg && scaleDegrees2[i] === 6))
    );

    if (incorrectLeadingTones.length === 0) {
        const plural = outerSeventhIndexes.length === 2;
        return {
            pointsLost: 0,
            isCorrect: true,
            message: `The leading tone${plural ? 's' : ''} in the following voice part${plural ? 's are' : ' is'} resolved correctly`,
            list: outerSeventhIndexes.map(i => VOICE_PARTS[i]),
            criterion
        };
    } else {
        const plural = incorrectLeadingTones.length === 2;
        return {
            pointsLost: 2,
            isCorrect: false,
            message: `The leading tone${plural ? 's' : ''} in the following voice part${plural ? 's are' : ' is'} not resolved correctly`,
            list: outerSeventhIndexes.map(i => VOICE_PARTS[i]),
            criterion
        };
    }
}

function flip2DArray<T>(array: T[][]): T[][] {
    if (array.length === 0) return [];
    
    const numRows = array.length;
    const numCols = array[0].length;

    const flippedArray: T[][] = Array.from({ length: numCols }, () => Array(numRows));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            flippedArray[j][i] = array[i][j];
        }
    }

    return flippedArray;
}

const M = noteToMidiIndex;


export function getVoiceLeadingReports(
    voiceLead: VoiceLead, correctChordRealizations: boolean[], chords: Chord[]): Result[] {
    
    const userChords = [
        voiceLead.bass,
        voiceLead.tenor,
        voiceLead.alto,
        voiceLead.soprano
    ];

    const isKeyMajor = voiceLead.keySignature.mode === 'major';
    
    let totalPoints = 0;

    let leaps = 0;

    const chordIntervals = flip2DArray(userChords.map(userChord => 
        userChord.map(({scaleDegree}) => scaleDegreeToInterval(scaleDegree, isKeyMajor))));
    const chordLetters = flip2DArray(userChords.map(userChord => userChord.map(({note}) => C_SCALE[note.step])));
    const chordIndices = flip2DArray(userChords.map(userChord => userChord.map(({note}) => note.pitch)));
    const scaleDegrees = flip2DArray(userChords.map(userChord => userChord.map(({scaleDegree}) => scaleDegree.degree)));

    const results: Result[] = [1,2,3,4,5,6].map(i => {

        console.log(findLeaps2(scaleDegrees[i - 1], chordIndices[i - 1], scaleDegrees[i], chordIndices[i]).length);

        if (!correctChordRealizations[i - 1] || !correctChordRealizations[i]) {
            const both = !correctChordRealizations[i - 1] && !correctChordRealizations[i];
            return {
                title: `Chord ${i} → ${i + 1}`,
                points: 0,
                feedbacks: [{
                    isCorrect: false,
                    message:`Chord${both ? 's' : ''} ${!correctChordRealizations[i - 1] ? i : ''} ${both ? 'and' : ''} ${!correctChordRealizations[i] ? i + 1 : ''} ${both ? 'are' : 'is'} not spelled correctly.`,
                    pointsLost: 2,
                    criterion: {
                        numeral: 'II',
                        letter: 'E',
                    }
                }],
            };
        }

        //leaps += findLeaps(chordLetters[i - 1], chordLetters[i]).length;
        leaps += findLeaps2(scaleDegrees[i - 1], chordIndices[i - 1], scaleDegrees[i], chordIndices[i]).length;

        let points = 2;

        const feedbacks = Object.entries({
            'findParallelUnisons': findParallelUnisons(chordIndices[i - 1], chordIndices[i]),
            'findParallelFifths': findParallelFifths(chordIndices[i - 1], chordIndices[i]),
            'findParallelOctaves': findParallelOctaves(chordIndices[i - 1], chordIndices[i]),
            'findUncharacteristicUnequalFifths': findUncharacteristicUnequalFifths(chordIndices[i - 1], chordIndices[i], chords[i]),
            'isNotHiddenFifth': isNotHiddenFifth([chordIndices[i - 1][0], chordIndices[i - 1][3]], [chordIndices[i][0], chordIndices[i][3]]),
            'isNotHiddenOctave': isNotHiddenOctave([chordIndices[i - 1][0], chordIndices[i - 1][3]], [chordIndices[i][0], chordIndices[i][3]]),
            'findOverlappingVoices': findOverlappingVoices(chordIndices[i - 1], chordIndices[i]),
            'findIncorrectApproachToChordalSeventh': findIncorrectApproachToChordalSeventh(chordIndices[i - 1], chordIndices[i], chordIntervals[i], chords[i], isKeyMajor),
            'findUncharacteristicLeaps': findUncharacteristicLeaps(chordIndices[i - 1], scaleDegrees[i - 1], chordIndices[i], scaleDegrees[i]),
            'findUnresolvedChordalSeventh': findUnresolvedChordalSeventh(scaleDegrees[i - 1], scaleDegrees[i], [i === 1 ? null : chords[i - 2], chords[i - 1], chords[i]], isKeyMajor),
            'findUnresolvedOuterLeadingTone': findUnresolvedOuterLeadingTone(chordIntervals[i - 1], chordIndices[i - 1], scaleDegrees[i - 1], chordIndices[i], scaleDegrees[i], [i === 1 ? null : chords[i - 2], chords[i - 1], chords[i]]),
        })
        .filter(([, v]) => v !== null)
        .map<Feedback>(([key, value], i) => {
            let fb: Feedback;
            if (key in voiceLeadingOutlinesWith2DArrays) {
                fb = feedbackTransformers["2Darray"](
                    voiceLeadingOutlinesWith2DArrays, 
                    key, 
                    value as number[][]);
            } else if (key in voiceLeadingOutlinesWithArrays) {
                fb = feedbackTransformers.array(
                    voiceLeadingOutlinesWithArrays, 
                    key, 
                    value as number[]);
            } else if (key in voiceLeadingOutlinesWithBooleans) {
                fb = feedbackTransformers.boolean(
                    voiceLeadingOutlinesWithBooleans, 
                    key, 
                    value as boolean);
            } else {
                fb = value as Feedback;
            }
            if (!fb.isCorrect && points > 0) {
                points -= fb.pointsLost;
            }
            return fb;
        });

        totalPoints += Math.max(points, 0);

        return {
            title: `Chord ${i} → ${i + 1}`,
            feedbacks,
            points: Math.max(points, 0),
            chords: [chords[i - 1], chords[i]],
        };
    });

    const leapingPointsLost = totalPoints < 12 || leaps <= 5
            ? 0
            : 1;
            
    totalPoints -= leapingPointsLost;

    const leapsResult: Result = {
        title: 'Number of Leaps',
        points: -leapingPointsLost,
        feedbacks: [{
            isCorrect: leaps <= 5,
            message: `${leaps <= 5 ? 'Less' : 'More'} than 5 leaps in the upper voices`,
            pointsLost: leapingPointsLost,
            criterion: {
                numeral: 'II',
                letter: 'B',
                number: [leaps <= 5 ? 1 : 2]
            }
        }],
    };

    results.unshift(leapsResult);

    return results;
}