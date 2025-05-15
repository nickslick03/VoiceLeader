import { test, expect } from "vitest";
import { findLeaps, getInterval, findUncharacteristicUnequalFifths, isNotHiddenFifth, isNotHiddenOctave, findIncorrectApproachToChordalSeventh, findParallelFifths, findParallelOctaves, findParallelUnisons, findOverlappingVoices, findUncharacteristicLeaps, findUnresolvedChordalSeventh, findUnresolvedOuterLeadingTone, findLeaps2 } from "../util/voiceLeadingGrader";
import { noteToMidiIndex } from "../util/converters";
import { majorIntervals, VOICE_PARTS } from "../util/consts";
import { Chord } from "../util/types";
const M = noteToMidiIndex;
const MI = majorIntervals;

test('findLeaps', () => {

    expect(findLeaps(
        ['C', 'G', 'E', 'C'], 
        ['G', 'D', 'D', 'B']))
    .toEqual([1]);

    expect(findLeaps(
        ['A', 'C', 'E', 'A'],
        ['G', 'B', 'D', 'G']
    )).toEqual([]);
});

test('findLeaps2', () => {

    expect(findLeaps2(
        [1, 5, 3, 1],
        [M('C3'), M('G3'), M('E4'), M('C5')],
        [5, 2, 2, 7] ,
        [M('G3'), M('D4'), M('D4'), M('B4')]))
    .toEqual([1]);

    expect(findLeaps2(
        [6, 1, 3, 6],
        [M('A3'), M('C4'), M('E4'), M('A4')],
        [5, 7, 2, 5],
        [M('G3'), M('B3'), M('D4'), M('G4')]
    )).toEqual([]);

    expect(findLeaps2(
        [6, 1, 3, 6],
        [M('A3'), M('C4'), M('E4'), M('A4')],
        [5, 7, 2, 5],
        [M('G4'), M('B5'), M('D5'), M('G5')]
    )).toEqual([1, 2, 3]);

});

test('getInterval', () => {

    expect(getInterval(48, 48)) // C3 to C3
    .toEqual({
        octaves: 0,
        interval: '0'
    });

    expect(getInterval(48, 49)) // C3 to Db3
    .toEqual({
        octaves: 0,
        interval: 'm2'
    });

    expect(getInterval(48, 55)) // C3 to G3
    .toEqual({
        octaves: 0,
        interval: 'P5'
    });

    expect(getInterval(48, 60)) // C3 to C4
    .toEqual({
        octaves: 1,
        interval: '0'
    });

    expect(getInterval(48, 71)) // C3 to B4
    .toEqual({
        octaves: 1,
        interval: 'M7'
    });
});

test('findUncharacteristicUnequalFifths', () => {

    // no motion -> []
    expect(
        findUncharacteristicUnequalFifths(
            [36, 43, 52, 60],
            [36, 43, 52, 60],
            {
                numeral: 1,
                quality: "major",
                isSeventh: false,
                inversion: 0,
                secondary: 1,
                secondaryQuality: 'major'
            }
        )
    ).toEqual([]);

    // Ex. 4 -> [0, 2] (bass and alto)
    expect(
        findUncharacteristicUnequalFifths(
            [35, 38, 53, 59],
            [36, 43, 55, 60],
            {
                numeral: 1,
                quality: "major",
                isSeventh: false,
                inversion: 0,
                secondary: 1,
                secondaryQuality: 'major'
            }
        )
    ).toEqual([[0, 2]]);

    // Ex. 4 in upper voice WITH I^6 -> []
    expect(
        findUncharacteristicUnequalFifths(
            [26, 35, 38, 53],
            [24, 36, 43, 55],
            {
                numeral: 1,
                quality: "major",
                isSeventh: false,
                inversion: 1,
                secondary: 1,
                secondaryQuality: 'major'
            }
        )
    ).toEqual([]);

    // descending d5->P5 -> []
    expect(
        findUncharacteristicUnequalFifths(
            [36, 43, 55, 60],
            [35, 38, 53, 59],
            {
                numeral: 1,
                quality: "major",
                isSeventh: false,
                inversion: 0,
                secondary: 1,
                secondaryQuality: 'major'
            }
        )
    ).toEqual([]);


    expect(
        findUncharacteristicUnequalFifths(
            [M('Eb2'), M('C3'), M('Ab3'), M('Eb4')],
            [M('Eb2'), M('Bb2'), M('G3'), M('Db4')],
            {
                numeral: 5,
                quality: 'majorMinor',
                isSeventh: true,
                inversion: 0,
                secondary: 1,
                secondaryQuality: 'major'
            }
        )
    ).toEqual([]);
});

test('isHiddenFifth', () => {

    expect(
        isNotHiddenFifth(
            [40, 60], 
            [43, 62]
        )
    ).toBe(true);

    expect(
        isNotHiddenFifth(
            [41, 57],
            [43, 62]
        )
    ).toBe(false);
});

test('isHiddenOctave', () => {

    expect(
        isNotHiddenOctave(
            [35, 60], 
            [38, 62]
        )
    ).toBe(true);

    expect(
        isNotHiddenOctave(
            [36, 57],
            [38, 62]
        )
    ).toBe(false);
});

test('findIncorrectApproachToChordalSeventh', () => {

    const domSeventh: Chord = {
        numeral: 5,
        quality: 'majorMinor',
        isSeventh: true,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    expect(
        findIncorrectApproachToChordalSeventh(
            [M('C2'), M('G2'), M('E3'), M('C4')],
            [M('G2'), M('B2'), M('D3'), M('F3')],
            [MI[5 - 1], MI[7 - 1], MI[2 - 1], MI[4 - 1]],
            domSeventh,
            true
        )
    ).toEqual([3]);

    expect(
        findIncorrectApproachToChordalSeventh(
            [M('C2'), M('G2'), M('E3'), M('C4')],
            [M('G2'), M('B2'), M('D3'), M('F3')],
            [MI[5 - 1], MI[7 - 1], MI[2 - 1], MI[4 - 1]],
            domSeventh,
            true
        )
    ).toEqual([3]);

    expect(
        findIncorrectApproachToChordalSeventh(
            [M('C2'), M('G2'), M('E3'), M('C4')],
            [M('G2'), M('D3'), M('F3'), M('G4')],
            [MI[5 - 1], MI[7 - 1], MI[2 - 1], MI[4 - 1]],
            domSeventh,
            true
        )
    ).toEqual([]);
});

test('findParallelFifths', () => {

    expect(
        findParallelFifths(
            [M('F2'), M('A2'), M('C3'), M('C4')],
            [M('G2'), M('B2'), M('G3'), M('D4')]
        )
    ).toEqual([[0, 3]]);

    expect(
        findParallelFifths(
            [M('F2'), M('A2'), M('C3'), M('A3')],
            [M('G2'), M('E2'), M('B3'), M('D4')]
        )
    ).toEqual([]);

    expect(
        findParallelFifths(
            [M('F1'), M('F3'), M('A3'), M('C4')],
            [M('C2'), M('E2'), M('C3'), M('G3')],
        )
    ).toEqual([[0, 3]]);

    expect(
        findParallelFifths(
            [M('D2'), M('A2'), M('D3'), M('A3')],
            [M('A1'), M('E2'), M('A2'), M('E3')]
        )
    ).toEqual([
        [0, 1],
        [0, 3],
        [2, 3]
    ]);
});

test('findParallelOctaves', () => {
    
    expect(
        findParallelOctaves(
            [M('F2'), M('F3'), M('A3'), M('C4')],
            [M('C2'), M('C3'), M('E3'), M('G3')],
        )
    ).toEqual([[0, 1]]);

    expect(
        findParallelOctaves(
            [M('F2'), M('F3'), M('A3'), M('C4')],
            [M('C2'), M('E2'), M('C3'), M('G3')],
        )
    ).toEqual([]);
});

test('findUnisions', () => {

    expect(
        findParallelUnisons(
            [M('C2'), M('E2'), M('G2'), M('G2')],
            [M('F2'), M('A2'), M('C2'), M('C2')]
        )
    ).toEqual([[2,3]]);
});

test('findOverlappingVoices', () => {

    expect(
        findOverlappingVoices(
            [M('G1'), M('A2'), M('C3'), M('G3')],
            [M('G1'), M('D3'), M('F3'), M('G3')],
        )
    ).toEqual([[2, 1]]);

    expect(
        findOverlappingVoices(
            [M('G1'), M('D3'), M('F3'), M('G3')],
            [M('G1'), M('A2'), M('C3'), M('G3')],
        )
    ).toEqual([[1, 2]]);

    expect(
        findOverlappingVoices(
            [M('G1'), M('C3'), M('D3'), M('G3')],
            [M('G1'), M('A2'), M('F3'), M('G3')],
        )
    ).toEqual([]);

    expect(
        findOverlappingVoices(
            [M('G1'), M('G1'), M('G1'), M('G1')],
            [M('G2'), M('G2'), M('G2'), M('G2')],
        )
    ).toEqual([
        [
          1,
          0,
        ],
        [
          2,
          0,
        ],
        [
          3,
          0,
        ],
        [
          2,
          1,
        ],
        [
          3,
          1,
        ],
        [
          3,
          2,
        ]
    ]);
});

test('findUncharacteristicLeaps', () => {
    expect(
        findUncharacteristicLeaps(
            [M('C1'), M('E1'), M('G1'), M('C2')],
            [1, 3, 5, 1],
            [M('D1'), M('A#1'), M('D#2'), M('D#2')],
            [2, 6, 2, 2],
        )
    ).toEqual([
        [1, 1],
        [2, 2],
        [3, 0]
    ])
});

test('findUnresolvedChordalSeventh', () => {
    const domSeventh: Chord = {
        numeral: 5,
        quality: 'majorMinor',
        isSeventh: true,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    const tonMaj: Chord = {
        numeral: 1,
        quality: 'major',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    const tonMin: Chord = {
        numeral: 1,
        quality: 'minor',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'minor'
    };

    const domSecondInversionSeventh: Chord = {
        numeral: 5,
        quality: 'majorMinor',
        isSeventh: true,
        inversion: 2,
        secondary: 1,
        secondaryQuality: 'major'
    };

    const tonFirstInversionMin: Chord = {
        numeral: 1,
        quality: 'minor',
        isSeventh: false,
        inversion: 1,
        secondary: 1,
        secondaryQuality: 'minor'
    };

    expect(
        findUnresolvedChordalSeventh(
            [5, 4, 5, 7],
            [1, 3, 5, 1],
            [null, domSeventh, tonMaj]
        )?.message
    ).toEqual('Chordal seventh in the tenor part is resolved correctly');

    expect(
        findUnresolvedChordalSeventh(
            [5, 4, 5, 7],
            [1, 5, 3, 1],
            [null, domSeventh, tonMaj]
        )?.message
    ).toEqual('Chordal seventh in the tenor part is not resolved correctly');

    expect(
        findUnresolvedChordalSeventh(
            [2, 5, 4, 7],
            [3, 5, 5, 1],
            [tonMin, domSecondInversionSeventh, tonFirstInversionMin]
        )?.message
    ).toEqual('Chordal seventh in the alto part is resolved correctly');
});

test('findUnresolvedOuterLeadingTone', () => {
    const domSeventh: Chord = {
        numeral: 5,
        quality: 'majorMinor',
        isSeventh: true,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    const tonMaj: Chord = {
        numeral: 1,
        quality: 'major',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    const submedFirstInversionMin: Chord = {
        numeral: 6,
        quality: 'minor',
        isSeventh: false,
        inversion: 0,
        secondary: 1,
        secondaryQuality: 'major'
    };

    expect(
        findUnresolvedOuterLeadingTone(
            [M('G2'), M('F3'), M('G3'), M('B3')].map(m => m % 12),
            [M('G2'), M('F3'), M('G3'), M('B3')],
            [5, 4, 5, 7],
            [M('C2'), M('E3'), M('G3'), M('C4')],
            [1, 3, 5, 1],
            [null, domSeventh, tonMaj]
        )
    ).toMatchObject({
        isCorrect: true,
        message: 'The leading tone in the following voice part is resolved correctly',
        list: [VOICE_PARTS[3]]
    });

    expect(
        findUnresolvedOuterLeadingTone(
            [M('G2'), M('F3'), M('G3'), M('B3')].map(m => m % 12),
            [M('G2'), M('F3'), M('G3'), M('B3')],
            [5, 4, 5, 7],
            [M('C2'), M('E3'), M('C4'), M('G3')],
            [1, 3, 5, 1],
            [null, domSeventh, tonMaj]
        )
    ).toMatchObject({
        isCorrect: false,
        message: 'The leading tone in the following voice part is not resolved correctly',
        list: [VOICE_PARTS[3]]
    });

    expect(
        findUnresolvedOuterLeadingTone(
            [M('G2'), M('F3'), M('G3'), M('B3')].map(m => m % 12),
            [M('G2'), M('F3'), M('G3'), M('B3')],
            [5, 4, 5, 7],
            [M('A2'), M('C3'), M('E4'), M('A3')],
            [6, 1, 3, 6],
            [tonMaj, domSeventh, submedFirstInversionMin]
        )
    ).toMatchObject({
        isCorrect: true,
        message: 'The leading tone in the following voice part is resolved correctly',
        list: [VOICE_PARTS[3]]
    });
}); 