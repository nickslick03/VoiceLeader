import { Chord, ScaleDegree, VoicePart, realizeChord, scaleDegreeToInterval, secondaryNumeralToNumeral } from "./converters";

export type Message = {
    isCorrect: boolean;
    message: string;
    list?: string[];
}

export type Result = {
    messages: Message[];
    points: number;
}

const CHORD_DEGREES = [1, 3, 5, 7];

export const VOICE_PARTS = ['bass part', 'tenor part', 'alto part', 'soprano part'];

const CHORD_ORDINALS = ['1st', '3rd', '5th', '7th'];

const chordSpellingOutline = [
    {
       function: checkChordSpelling, 
       points: 1,
       correctMessage: 'The chord is spelled correctly',
       errorMessage: 'The chord is misspelled in the:',
       array: VOICE_PARTS
    },
    {
        function: checkEnharmonics,
        points: 1,
        correctMessage: 'The chord is spelled correctly enharmonically',
        errorMessage: 'The chord is enharmonically misspelled in the:',
        array: VOICE_PARTS
    },
    {
        function: isCorrectInversion,
        points: 1,
        correctMessage: 'The chord spelling is in the correct inversion',
        errorMessage: 'The chord spelling is not in the correct inversion',
        array: null
    },
    {
        function: ommittedNotes,
        points: 1,
        correctMessage: 'The chord spelling has no ommitted notes',
        errorMessage: 'The chord spelling has the following scale degrees ommitted:',
        array: CHORD_ORDINALS
    },
    {
        function: doubledLeadingTone,
        points: .5,
        correctMessage: 'The leading tone is not doubled',
        errorMessage: 'The leading tone is doubled in the:',
        array: VOICE_PARTS
    },
    {
        function: doubledChordalSeventh,
        points: .5,
        correctMessage: 'The chordal seventh is not doubled',
        errorMessage: 'The chordal seventh is doubled in the:',
        array: VOICE_PARTS
    },
    {
        function: is64ChordDoubledCorrectly,
        points: .5,
        correctMessage: 'The fifth in the 6 4 chord is doubled',
        errorMessage: 'The fifth in the 6 4 chord is not doubled',
        array: null
    },
    {
        function: voiceDistance,
        points: .5,
        correctMessage: 'All adjacent upper voices are within an octave apart',
        errorMessage: 'These adjacent upper voices are more than an octave apart:',
        array: ['tenor to alto', 'alto to soprano']
    },
    {
        function: voiceCrossings,
        points: .5,
        correctMessage: 'There are no voice crossings',
        errorMessage: 'There are voice crossings between these voice parts',
        array: ['bass to alto', 'bass to soprano', 'tenor to alto', 'tenor to soprano']
    }
]

/**
 * Checks if the intervals of the chord are correct.
 * @param chordIntervals the intervals of the chord the user entered
 * @param correctIntervals the intervals of the actual chord
 * @returns an array of the indicies of the chordIntervals array that are wrong notes. If empty, the user did not enter any wrong notes.
 */
export function checkChordSpelling(chordIntervals: number[], correctIntervals: number[]) {
    return chordIntervals.reduce<number[]>((arr, interval, index) => {
        if (!correctIntervals.includes(interval)) arr.push(index);
        return arr;
    }, []);
}

/**
 * Checks if the notes in a chord are enharmonically correct.
 * @param degreeList the list of scale degrees of the notes in the chord
 * @param chordNumeral The numeral of the chord (1-7)
 * @param isSeventh Whether the chord is a seventh chord
 * @returns an array of the indicies of the degreeList array that are enharmonically incorrect. If empty, all the notes are enharmonically correct.
 */
export function checkEnharmonics(degreeList: ScaleDegree[], chordNumeral: number, isSeventh: boolean) {
    return degreeList.reduce<number[]>((arr, degree, index) => {
        const chordDegree = ((degree.degree + (7 - chordNumeral)) % 7) + 1;
        if (
            CHORD_DEGREES.indexOf(chordDegree) === -1
            || !isSeventh && chordDegree === 7
            || chordDegree === 1 && degree.accidental !== 0) 
            arr.push(index);
        return arr;
    }, []);
}

/**
 * Checks if the bass note is the correct inversion.
 * @param bassInterval the interval of the bass note (0-11)
 * @param correctIntervalList a list of the correct intervals of the chord in root position
 * @param inversion the inversion of the chord
 * @returns A boolean indicating whether the bass note is the correct inversion.
 */
export function isCorrectInversion(bassInterval: number, correctIntervalList: number[], inversion: number) {
    return bassInterval == correctIntervalList[inversion];
}

/**
 * Checks if the chordDegrees array has any omitted notes. 
 * Covers I. Chord Spelling, Spacing, and Doubling > A. > 2, 3, 4
 * @param chordIntervals the chord intervals of the notes the user entered, from bass to soprano
 * @param completeIntervals the chord intervals the chordDegrees should match
 * @param isRootPosition a boolean indicating whether the chord is in root position
 * @returns an array of the index of the chord degree the user ommitted. If empty, the user did not omit any notes.
 */
export function ommittedNotes(
    chordIntervals: number[], completeIntervals: number[], isRootPosition: boolean): number[] {
    return completeIntervals.reduce<number[]>((arr, interval, index) => {
        const isIncluded = chordIntervals.includes(interval);
        const isFifth = interval == completeIntervals[2];
        if(!(isIncluded || isRootPosition && isFifth)) {
            arr.push(index);
        }
        return arr;
    }, []); 
}

/**
 * Checks if a chord has two of the same notes or more.
 * @param chordIntervals the chord intervals of the notes the user entered, from bass to soprano
 * @param searchInterval the interval to search for doubling
 * @returns false if all the notes are different or a list of indicies of the doubleInterval if doubled
 */
function doubledInterval(chordIntervals: number[], searchInterval: number) {
    const doubledList =  chordIntervals
        .map((interval, index) => interval === searchInterval ? index : -1)
        .filter(index => index > -1);
    return doubledList.length >= 2 ? doubledList : [];
}

/**
 * Checks if there is a doubled leading tone in a chord.
 * @param chordIntervals the chord intervals of the notes the user entered, from bass to soprano
 * @returns an array of indicies of the doubled leading tones. If empty, there are no doubled leading tones.
 */
export function doubledLeadingTone(chordIntervals: number[]) {
    return doubledInterval(chordIntervals, 11);
}

/**
 * Checks if the chordal seventh is doubled in a chord.
 * @param chordIntervals the chord intervals of the notes the user entered, from bass to soprano
 * @param seventh the chordal seventh
 * @returns an array of indicies of the doubled chordal sevenths. If empty, there are no doubled chordal sevenths.
 */
export function doubledChordalSeventh(chordIntervals: number[], seventh: number) {
    return doubledInterval(chordIntervals, seventh);
}

/**
 * Checks if a 2nd inverted triad (6/4 chord) is doubled incorrectly (doesn't double the fifth).
 * @param chordIntervals the chord intervals of the notes the user entered, from bass to soprano
 * @param fifth the fifth of the chord
 * @returns true if the fifth isn't doubled, false if the fifth is doubled.
 */
export function is64ChordDoubledCorrectly(chordIntervals: number[], fifth: number) {
    return chordIntervals.indexOf(fifth) !== chordIntervals.lastIndexOf(fifth);
}

/**
 * Checks if the distance between adjacent upper voices is greater than an octave.
 * @param tenorPitch the MIDI index of the tenor pitch
 * @param altoPitch the MIDI index of the alto pitch
 * @param sopranoPitch the MIDI index of the soprano pitch
 * @returns an array of indices representing the voices in which the distance is greater than an octave. 0 is tenor to alto, and 1 is alto to soprano. Empty if there are no upper adjacant voices with a distance greater than an octave.
 */
export function voiceDistance(tenorPitch: number, altoPitch: number, sopranoPitch: number) {
    return [
        altoPitch - tenorPitch > 12 ? 0 : -1,
        sopranoPitch - altoPitch > 12 ? 1 : -1
    ].filter(num => num !== -1);
}

/**
 * Checks for voice crossings between the voice parts.
 * @param bassPitch the MIDI index of the bass pitch
 * @param tenorPitch the MIDI index of the tenor pitch
 * @param altoPitch the MIDI index of the alto pitch
 * @param sopranoPitch the MIDI index of the soprano pitch
 * @returns an array of indicies where each index correlates with a voice crossing. 0 is bass to alto, 1 is bass to soprano, 2 is tenor to alto, 3 is tenor to soprano. Empty if there are no voice crossings.
 */
export function voiceCrossings(bassPitch: number, tenorPitch: number, altoPitch: number, sopranoPitch: number) {
    return [
        bassPitch > altoPitch ? 0 : -1,
        bassPitch > sopranoPitch ? 1 : -1,
        tenorPitch > altoPitch ? 2 : -1,
        tenorPitch > sopranoPitch ? 3 : -1
    ].filter(num => num !== -1);
}

/**
 * Grades a chord a user entered on how its spelled and returns a result object.
 * @param userChord The chord the user entered represented in an array of VoicePart objects, from bass to soprano
 * @param chord The chord object the user is attempting to realize
 * @param isKeyMajor A boolean representing whether the key is major. If false, the key is minor
 * @returns A result object.
 */
export function getChordSpellingReport(
    userChord: VoicePart, chord: Chord, isKeyMajor: boolean): Result {

    const chordIntervals = userChord.map(({scaleDegree}) => scaleDegreeToInterval(scaleDegree, isKeyMajor));
    const correctIntervals = realizeChord(chord, isKeyMajor);
    const degreeList = userChord.map(({scaleDegree}) => scaleDegree);
    const pitchList = userChord.map(({note}) => note.pitch);

    let points = 1;    

    const messages: Message[] = [
        checkChordSpelling(chordIntervals, correctIntervals),
        checkEnharmonics(
            degreeList, 
            chord.secondary > 1 
                ? secondaryNumeralToNumeral(chord.numeral, chord.secondary)
                : chord.numeral
            , chord.isSeventh),
        isCorrectInversion(chordIntervals[0], correctIntervals, chord.inversion),
        ommittedNotes(chordIntervals, correctIntervals, chord.inversion === 0),
        doubledLeadingTone(chordIntervals),
        chord.isSeventh ? doubledChordalSeventh(chordIntervals, correctIntervals[3]) : [],
        chord.inversion === 2 && !chord.isSeventh
            ? is64ChordDoubledCorrectly(chordIntervals, correctIntervals[2])
            : true,
        voiceDistance(pitchList[1], pitchList[2], pitchList[3]),
        voiceCrossings(pitchList[0], pitchList[1], pitchList[2], pitchList[3]),
    ].map<Message>((val, index) => {
        const isCorrect = typeof val === 'object'
        ? val.length === 0
        : val;
        if (!isCorrect) points -= chordSpellingOutline[index].points;
        const message = chordSpellingOutline[index][`${isCorrect ? 'correct' : 'error'}Message`];
        const list = !isCorrect && typeof val === 'object'
        ? val.map((num) => chordSpellingOutline[index].array![num])
        : undefined;
        return {
            isCorrect,
            message,
            list
        }
    });

    return {
        messages,
        points: points < 0 ? 0 : points
    };
}
