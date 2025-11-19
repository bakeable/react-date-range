import React from 'react';
import { addDays } from 'date-fns';
import DateRangePicker from '../DateRangePicker';
import renderer from 'react-test-renderer';

const endDate = new Date();
const startDate = addDays(endDate, -7);

const commonProps = {
  ranges: [{ startDate, endDate, key: 'selection' }],
  onChange: jest.fn(),
};

describe('DateRangePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render without crashing', () => {
    const testRenderer = renderer.create(<DateRangePicker {...commonProps} />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  test('Should render comparison toggle when showComparisonToggle is true', () => {
    const testRenderer = renderer.create(
      <DateRangePicker {...commonProps} showComparisonToggle={true} />
    );
    const instance = testRenderer.getInstance();

    expect(instance.renderToggleButton()).not.toBeNull();
  });

  test('Should not render comparison toggle when showComparisonToggle is false', () => {
    const testRenderer = renderer.create(
      <DateRangePicker {...commonProps} showComparisonToggle={false} />
    );
    const instance = testRenderer.getInstance();

    expect(instance.renderToggleButton()).toBeNull();
  });

  test('Should toggle comparison state when toggle button is clicked', () => {
    const onComparisonToggle = jest.fn();
    const testRenderer = renderer.create(
      <DateRangePicker
        {...commonProps}
        showComparisonToggle={true}
        onComparisonToggle={onComparisonToggle}
      />
    );
    const instance = testRenderer.getInstance();

    const initialState = instance.state.comparisonEnabled;
    instance.toggleComparison();

    expect(instance.state.comparisonEnabled).toBe(!initialState);
    expect(onComparisonToggle).toHaveBeenCalledWith(!initialState);
  });

  test('Should handle equal length ranges prop', () => {
    const testRenderer = renderer.create(
      <DateRangePicker {...commonProps} equalLengthRanges={true} />
    );

    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
