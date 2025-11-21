import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRange from '../DateRange';
import DefinedRange from '../DefinedRange';
import { findNextRangeIndex, generateStyles } from '../../utils';
import classnames from 'classnames';
import coreStyles from '../../styles';

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
      comparisonEnabled: props.ranges && props.ranges.length > 1,
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }

  toggleComparison = () => {
    const { ranges, onChange, onComparisonToggle } = this.props;
    const { comparisonEnabled } = this.state;
    const newComparisonEnabled = !comparisonEnabled;

    if (comparisonEnabled) {
      // Disable comparison - remove all ranges except the first one
      const firstRange = ranges[0];
      if (onChange && firstRange) {
        onChange({ [firstRange.key || 'range1']: firstRange });
      }
    } else {
      // Enable comparison - add a second range if it doesn't exist
      if (ranges.length === 1) {
        const firstRange = ranges[0];
        const secondRange = {
          startDate: null,
          endDate: null,
          key: 'comparison',
          color: this.props.rangeColors ? this.props.rangeColors[1] : '#3ecf8e',
        };
        if (onChange) {
          onChange({
            [firstRange.key || 'range1']: firstRange,
            [secondRange.key]: secondRange,
          });
        }
      }
    }

    this.setState({
      comparisonEnabled: newComparisonEnabled,
      focusedRange: newComparisonEnabled
        ? [0, 0]
        : [findNextRangeIndex(this.getVisibleRanges()), 0],
    });

    // Call the callback if provided
    if (onComparisonToggle) {
      onComparisonToggle(newComparisonEnabled);
    }
  };

  getVisibleRanges = () => {
    const { ranges } = this.props;
    const { comparisonEnabled } = this.state;

    if (!comparisonEnabled) {
      return ranges.slice(0, 1); // Only show first range
    }
    return ranges;
  };

  renderToggleButton = () => {
    const { showComparisonToggle } = this.props;
    const { comparisonEnabled } = this.state;

    if (!showComparisonToggle) return null;

    return (
      <div className={this.styles.comparisonToggleWrapper}>
        <button
          type="button"
          className={classnames(this.styles.comparisonToggle, {
            [this.styles.comparisonToggleEnabled]: comparisonEnabled,
          })}
          onClick={this.toggleComparison}>
          <span className={this.styles.comparisonToggleIcon}>{comparisonEnabled ? '✓' : '+'}</span>
          <span className={this.styles.comparisonToggleText}>
            {comparisonEnabled ? 'Comparison range enabled' : 'Comparison range disabled'}
          </span>
        </button>
      </div>
    );
  };

  render() {
    const { focusedRange } = this.state;
    const visibleRanges = this.getVisibleRanges();

    const { showInputRanges = true } = this.props;

    return (
      <div className={classnames(this.styles.dateRangePickerWrapper, this.props.className)}>
        <DefinedRange
          focusedRange={focusedRange}
          onPreviewChange={value =>
            this.dateRange.updatePreview(
              value ? this.dateRange.calcNewSelection(value, typeof value === 'string') : null
            )
          }
          {...this.props}
          // when showInputRanges is false, pass an empty array to disable defaultInputRanges
          inputRanges={showInputRanges ? this.props.inputRanges : []}
          ranges={visibleRanges}
          range={visibleRanges[focusedRange[0]]}
          className={undefined}
          footerContent={this.renderToggleButton()}
        />
        <DateRange
          onRangeFocusChange={focusedRange => this.setState({ focusedRange })}
          focusedRange={focusedRange}
          {...this.props}
          ranges={visibleRanges}
          ref={t => (this.dateRange = t)}
          className={undefined}
        />
      </div>
    );
  }
}

DateRangePicker.defaultProps = {
  showComparisonToggle: true,
  showInputRanges: true,
};

DateRangePicker.propTypes = {
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
  showComparisonToggle: PropTypes.bool,
  onComparisonToggle: PropTypes.func,
  showInputRanges: PropTypes.bool,
};

export default DateRangePicker;
