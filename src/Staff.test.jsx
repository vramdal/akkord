import React from 'react';
import {render, queries} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App from './App';
import {Chord} from './Staff.tsx';
import ShallowRenderer from 'react-test-renderer/shallow';
import {BaseTone} from "./Notes";
import {_testing} from "./Staff.tsx";

const {Note, ExtensionLines} = _testing;

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
        const [note] = result.props.children;
        expect(note.props).toMatchObject({"hasNeighbor": false, tone: expect.objectContaining(toneA0)});
    });

    it('should render two adjacent nodes as neighbors', () => {
        const toneA0 = {baseTone: BaseTone.A, octave: 0};
        const toneD0 = {baseTone: BaseTone.D, octave: 0};
        const toneH0 = {baseTone: BaseTone.H, octave: 0};
        const tones = [toneA0, toneD0, toneH0];

        const result = renderer.render( <Chord tones = {tones}/> );

        expect(result.props.children).toHaveLength(3);
        const [noteD0, noteA0, noteH0] = result.props.children;
        expect(noteA0.props).toMatchObject({"hasNeighbor": true, tone: expect.objectContaining(toneA0)});
        expect(noteH0.props).toMatchObject({"hasNeighbor": true, tone: expect.objectContaining(toneH0)});
        expect(noteD0.props).toMatchObject({"hasNeighbor": false, tone: expect.objectContaining(toneD0)});
    });
});

describe('Note', () => {
    const renderer = new ShallowRenderer();
    it('should render a single note', () => {
        const toneA0 = {baseTone: BaseTone.A, octave: 0};
        const x = 50;

        const result = renderer.render(<Note tone={toneA0} hasNeighbor={false} x={x}/>);
        const children = result.props.children.filter(child => child);

        expect(children).toHaveLength(1);
        const [noteHead] = children;
        expect(noteHead.props).toMatchObject({x: x, positionInStaff: 6});
    });

    it('should render a note with extension lines', () => {
        const toneA_1 = {baseTone: BaseTone.A, octave: -1};
        const x = 50;

        const result = renderer.render(<Note tone={toneA_1} hasNeighbor={false} x={x}/>);
        const children = result.props.children.filter(child => child);

        expect(children).toHaveLength(2);
        const [extensionLines, noteHead] = children;
        expect(extensionLines.props).toMatchObject({x: x, maxExtent: 13});
        expect(noteHead.props).toMatchObject({x: x, positionInStaff: 13});
    });
});

describe('Extension lines', () => {
    const renderer = new ShallowRenderer();
    it('should render extension lines above', () => {
        const x = 50;

        const result = renderer.render(<ExtensionLines x={x} maxExtent={-3}/>);
        const children = result.props.children.filter(child => child);

        expect(children).toHaveLength(2);
        const [line1, line2] = children;
        expect(line1.props).toMatchObject({position: 11});
        expect(line2.props).toMatchObject({position: 13});
    });
    it('should render extension lines below', () => {
        const x = 50;

        const result = renderer.render(<ExtensionLines x={x} maxExtent={13}/>);
        const children = result.props.children.filter(child => child);

        expect(children).toHaveLength(2);
        const [line1, line2] = children;
        expect(line1.props).toMatchObject({position: 11});
        expect(line2.props).toMatchObject({position: 13});
    });
});

