import React from 'react';
import {render, queries} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App';
import {Chord} from './Staff.tsx';
import ShallowRenderer from 'react-test-renderer/shallow';
import {BaseTone} from "./Notes";


it('should place an A note on the right place', () => {
    const {getByText, getByTestId} = render( < App />, { queries: {...queries} } ) ;

    expect(getByTestId('x:50,pos:5')).toBeInTheDocument();
})
;

describe('Chord', () => {
    const renderer = new ShallowRenderer();
    it('should render a single Note',() => {
        const toneA0 = {baseTone: BaseTone.A, octave: 0};

        const result = renderer.render( <Chord tones = {[toneA0]}/> );

        expect(result.props.children).toHaveLength(1);
        const note = result.props.children[0];
        expect(note.props).toMatchObject({"hasNeighbor": false, tone: expect.objectContaining(toneA0)});
    });

    it('should render two adjacent nodes as neighbors', () => {
        let toneA0 = {baseTone: BaseTone.A, octave: 0};
        let toneD0 = {baseTone: BaseTone.D, octave: 0};
        let toneH0 = {baseTone: BaseTone.H, octave: 0};
        const tones = [toneA0, toneD0, toneH0];

        const result = renderer.render( <Chord tones = {tones}/> );

        expect(result.props.children).toHaveLength(3);
        const noteD0 = result.props.children[0];
        const noteA0 = result.props.children[1];
        const noteH0 = result.props.children[2];
        expect(noteA0.props).toMatchObject({"hasNeighbor": true, tone: expect.objectContaining(toneA0)});
        expect(noteH0.props).toMatchObject({"hasNeighbor": true, tone: expect.objectContaining(toneH0)});
        expect(noteD0.props).toMatchObject({"hasNeighbor": false, tone: expect.objectContaining(toneD0)});
    });
});

