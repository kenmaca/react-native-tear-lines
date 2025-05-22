import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TearLines, { DEFAULT_TEAR_SIZE } from './TearLines'; // Assuming DEFAULT_TEAR_SIZE is exported

describe('<TearLines />', () => {
  it('Basic Rendering: renders the container and matches snapshot', () => {
    const { getByTestId, toJSON } = render(<TearLines />);
    expect(getByTestId('tear-lines-container')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders with onLayout update: calculates tears based on layout width', () => {
    const { getByTestId, getAllByTestId, toJSON } = render(<TearLines />);
    const container = getByTestId('tear-lines-container');

    fireEvent(container, 'layout', {
      nativeEvent: { layout: { width: 100 } },
    });

    // After layout, assuming DEFAULT_TEAR_SIZE is 10, there should be 10 tear elements.
    expect(getAllByTestId('tear-line-segment').length).toBe(100 / DEFAULT_TEAR_SIZE);
    expect(toJSON()).toMatchSnapshot('after layout 100');
  });

  it('Renders correctly with width prop: calculates tears based on prop width', () => {
    const propWidth = 150;
    const { getAllByTestId, toJSON } = render(<TearLines width={propWidth} />);
    
    expect(getAllByTestId('tear-line-segment').length).toBe(propWidth / DEFAULT_TEAR_SIZE);
    expect(toJSON()).toMatchSnapshot();
  });

  it('isUnder prop applies correct margin and matches snapshots', () => {
    const { toJSON, rerender } = render(<TearLines isUnder={true} width={100}/>); // Added width for consistent snapshots
    expect(toJSON()).toMatchSnapshot("isUnder true");

    rerender(<TearLines isUnder={false} width={100} />); // Added width for consistent snapshots
    expect(toJSON()).toMatchSnapshot("isUnder false");
  });

  it('Custom tearSize prop: calculates tears with custom size', () => {
    const propWidth = 100;
    const customTearSize = 20;
    const { getAllByTestId, toJSON } = render(
      <TearLines width={propWidth} tearSize={customTearSize} />
    );

    expect(getAllByTestId('tear-line-segment').length).toBe(propWidth / customTearSize);
    expect(toJSON()).toMatchSnapshot();
  });
});
