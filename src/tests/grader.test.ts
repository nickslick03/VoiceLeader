import { test, expect } from "vitest";
import { 
    is64ChordDoubledCorrectly, 
    doubledChordalSeventh, 
    ommittedNotes, 
    voiceCrossings, 
    voiceDistance, 
    doubledLeadingTone, 
    checkChordSpelling, 
    checkEnharmonics, 
    isCorrectInversion 
} from "../util/grader";
import { realizeChord } from "../util/converters";

test('checkChordSpelling', () => {

    expect(checkChordSpelling(
        [0, 4, 7],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 0
        }, true)
    )).toEqual([]);

    expect(checkChordSpelling(
        [0, 4, 7],
        realizeChord({
            numeral: 1,
            quality: 'minor',
            isSeventh: false,
            inversion: 0
        }, true)
    )).toEqual([1]);

    expect(checkChordSpelling(
        [0, 4, 7],
        realizeChord({
            numeral: 1,
            quality: 'diminished',
            isSeventh: false,
            inversion: 0
        }, true)
    )).toEqual([1, 2]);
});

test('checkEnharmonics', () => {

    expect(checkEnharmonics(
        [1, 3, 5].map(degree => ({
            degree,
            accidental: 0
        })), 1, false
    )).toEqual([]);

    expect(checkEnharmonics(
        [5, 7, 2].map(degree => ({
            degree,
            accidental: 0
        })), 5, false
    )).toEqual([]);

    expect(checkEnharmonics(
        [1, 2, 5].map(degree => ({
            degree,
            accidental: 0
        })), 1, false
    )).toEqual([1]);

    expect(checkEnharmonics(
        [5, 6, 2].map(degree => ({
            degree,
            accidental: 0
        })), 5, false
    )).toEqual([1]);

    expect(checkEnharmonics(
        [1, 3, 5, 7].map(degree => ({
            degree,
            accidental: 0
        })), 1, false
    )).toEqual([3]);

    expect(checkEnharmonics(
        [1, 3, 5, 7].map(degree => ({
            degree,
            accidental: 0
        })), 1, true
    )).toEqual([]);

    expect(checkEnharmonics(
        [
            {degree: 4, accidental: 1},
            {degree: 6, accidental: 0},
            {degree: 1, accidental: 0},
        ],
        4,
        false
    )).toEqual([0])
});

test('isCorrectInversion', () => {

    expect(isCorrectInversion(0, [0, 4, 7], 0)).toBe(true);

    expect(isCorrectInversion(11, [7, 11, 2], 1)).toBe(true);

    expect(isCorrectInversion(7, [0, 3, 7], 2)).toBe(true);

    expect(isCorrectInversion(4, [0, 4, 7], 0)).toBe(false);
});

test('ommittedNotes', () => {

    // I in root pos
    expect(ommittedNotes(
        [0, 4, 7],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 0
        }, true),
        true
    )).toEqual([]);

    // I in root pos without scale degree 5 (ok)
    expect(ommittedNotes(
        [0, 4, 4],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 0
        }, true),
        true
    )).toEqual([]);

    // I in root pos without scale degree 3 (not ok)
    expect(ommittedNotes(
        [0, 7, 7],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 0
        }, true),
        true
    )).toEqual([1]);


    // I in 1st inversion
    expect(ommittedNotes(
        [4, 7, 0],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 1
        }, true),
        false
    )).toEqual([]);

    // I in 1st inversion without scale degree 5 (not ok)
    expect(ommittedNotes(
        [4, 0, 0],
        realizeChord({
            numeral: 1,
            quality: 'major',
            isSeventh: false,
            inversion: 1
        }, true),
        false
    )).toEqual([2]);
});

test('doubledLeadingTone', () => {

    expect(doubledLeadingTone(
        realizeChord({
            numeral: 5,
            quality: 'major',
            isSeventh: true,
            inversion: 0
        }, true)
    )).toEqual([]);

    expect(doubledLeadingTone(
        [7, 11, 11, 2]
    )).toEqual([1, 2]);

    expect(doubledLeadingTone(
        [11, 7, 11, 11]
    )).toEqual([0, 2, 3]);
});

test('doubledChordalSeventh', () => {

    expect(doubledChordalSeventh([7, 11, 2, 5], 5)).toEqual([]);

    expect(doubledChordalSeventh([7, 11, 5, 5], 5)).toEqual([2, 3]);
});

test('is64ChordDoubledCorrectly', () => {

    expect(is64ChordDoubledCorrectly([7, 0, 4, 7], 7)).toBe(true);

    expect(is64ChordDoubledCorrectly([7, 0, 4, 4], 7)).toBe(false);
});

test('voiceDistance', () => {

    expect(voiceDistance(52, 55, 60)).toEqual([]);

    expect(voiceDistance(48, 64, 67)).toEqual([0]);

    expect(voiceDistance(52, 55, 72)).toEqual([1]);

    expect(voiceDistance(48, 64, 77)).toEqual([0, 1]);
});

test('voiceCrossings', () => {

    expect(voiceCrossings(48, 52, 55, 60)).toEqual([]);

    expect(voiceCrossings(52, 55, 48, 60)).toEqual([0, 2]);

    expect(voiceCrossings(48, 55, 52, 60)).toEqual([2]);

    expect(voiceCrossings(48, 60, 52, 55)).toEqual([2, 3]);

    expect(voiceCrossings(55, 60, 48, 52)).toEqual([0, 1, 2, 3]);
});