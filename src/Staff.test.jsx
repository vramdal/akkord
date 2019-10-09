import React from "react";
import { render, queries } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import Staff, { Chord } from "./Staff.tsx";
import ShallowRenderer from "react-test-renderer/shallow";
import TestRenderer from "react-test-renderer";
import { BaseTone } from "./Notes";
import { _testing } from "./Staff.tsx";

const { Note, ExtensionLines } = _testing;

const toneA_1 = {
  baseTone: BaseTone.A,
  octave: -1,
  midiNote: 36,
  strKey: "A-1",
  staffPosition: 13,
  hasNeighbor: false
};
const toneA0 = {
  baseTone: BaseTone.A,
  octave: 0,
  midiNote: 12,
  strKey: "A0",
  staffPosition: 6,
  hasNeighbor: false
};
const toneA1 = {
  baseTone: BaseTone.A,
  octave: 1,
  midiNote: 12,
  strKey: "A1",
  staffPosition: -2,
  hasNeighbor: false
};

describe("integration", () => {
  it("should render staff and chord", () => {
    const testRenderer = TestRenderer.create(
      <Staff
        tones={[
          { baseTone: BaseTone.A, octave: 0 },
          { baseTone: BaseTone.C, octave: 0 }
        ]}
      />
    );
    // noinspection HtmlUnknownAttribute
    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="staff"
      >
        <svg
          className="staff"
          height="300"
          width="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="staff__line"
            height="4"
            width={200}
            x={0}
            y={25}
          />
          <rect
            className="staff__line"
            height="4"
            width={200}
            x={0}
            y={49}
          />
          <rect
            className="staff__line"
            height="4"
            width={200}
            x={0}
            y={73}
          />
          <rect
            className="staff__line"
            height="4"
            width={200}
            x={0}
            y={97}
          />
          <rect
            className="staff__line"
            height="4"
            width={200}
            x={0}
            y={121}
          />
          <rect
            className="staff__line"
            height="4"
            width={40}
            x={30}
            y={145}
          />
          <ellipse
            className="note__head"
            cx={50}
            cy={147}
            data-testid="x:50,pos:11"
            rx={11}
            ry={11}
          />
          <ellipse
            className="note__head"
            cx={50}
            cy={87}
            data-testid="x:50,pos:6"
            rx={11}
            ry={11}
          />
        </svg>
      </div>
    `);
  });
});

it("should place an A note on the right place", () => {
  const { getByTestId } = render(<App />, {
    queries: { ...queries }
  });

  expect(getByTestId("x:50,pos:5")).toBeInTheDocument();
});

describe("Chord", () => {
  const renderer = new ShallowRenderer();
  it("should render a single Note", () => {
    const toneA0 = { baseTone: BaseTone.A, octave: 0 };

    const result = renderer.render(<Chord tones={[toneA0]} />);

    expect(result.props.children).toHaveLength(1);
    const [note] = result.props.children;
    expect(note.props).toMatchObject({
      toneInfo: expect.objectContaining({ ...toneA0, hasNeighbor: false })
    });
  });

  it("should render two adjacent nodes as neighbors", () => {
    const toneA0 = { baseTone: BaseTone.A, octave: 0 };
    const toneD0 = { baseTone: BaseTone.D, octave: 0 };
    const toneH0 = { baseTone: BaseTone.H, octave: 0 };
    const tones = [toneA0, toneD0, toneH0];

    const result = renderer.render(<Chord tones={tones} />);

    expect(result.props.children).toHaveLength(3);
    const [noteD0, noteA0, noteH0] = result.props.children;
    expect(noteD0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneD0,
        hasNeighbor: false,
        isTop: false,
        isBottom: true
      })
    });
    expect(noteA0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneA0,
        hasNeighbor: true,
        isTop: false,
        isBottom: false
      })
    });
    expect(noteH0.props).toMatchObject({
      toneInfo: expect.objectContaining({
        ...toneH0,
        hasNeighbor: true,
        isTop: true,
        isBottom: false
      })
    });
  });
});

describe("Note", () => {
  const renderer = new ShallowRenderer();
  const x = 50;

  it("should render a single note", () => {
    const result = renderer.render(<Note toneInfo={toneA0} x={x} />);
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(1);
    const [noteHead] = children;
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: 6 });
  });

  it("should render a note with extension lines below", () => {
    const result = renderer.render(
      <Note toneInfo={{ ...toneA_1, isBottom: true }} x={x} />
    );
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [extensionLines, noteHead] = children;
    expect(extensionLines.props).toMatchObject({ x: x, maxExtent: 13 });
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: 13 });
  });

  it("should render a note with extension lines above", () => {
    const result = renderer.render(
      <Note toneInfo={{ ...toneA1, isTop: true }} x={x} />
    );
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [extensionLines, noteHead] = children;
    expect(extensionLines.props).toMatchObject({ x: x, maxExtent: -2 });
    expect(noteHead.props).toMatchObject({ x: x, positionInStaff: -2 });
  });
});

describe("Extension lines", () => {
  const renderer = new ShallowRenderer();
  it("should render extension lines above", () => {
    const x = 50;

    const result = renderer.render(<ExtensionLines x={x} maxExtent={-3} />);

    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [line1, line2] = children;
    expect(line1.props).toMatchObject({ position: -1 });
    expect(line2.props).toMatchObject({ position: -3 });
  });
  it("should render extension lines below", () => {
    const x = 50;

    const result = renderer.render(<ExtensionLines x={x} maxExtent={13} />);
    const children = result.props.children.filter(child => child);

    expect(children).toHaveLength(2);
    const [line1, line2] = children;
    expect(line1.props).toMatchObject({ position: 11 });
    expect(line2.props).toMatchObject({ position: 13 });
  });
});
