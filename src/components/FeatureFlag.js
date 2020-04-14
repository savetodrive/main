import React from 'react';
import PropTypes from 'prop-types';

class FeatureFlag extends React.Component {
  static init(featureName = 'feature') {
    if (
      FeatureFlag.IS_FEATURE === null ||
      FeatureFlag.IS_FEATURE === undefined
    ) {
      if (window.localStorage && window.localStorage.getItem(featureName)) {
        FeatureFlag.IS_FEATURE = true;
      } else {
        FeatureFlag.IS_FEATURE = false;
      }
    }
  }
  static isFeature() {
    return FeatureFlag.IS_FEATURE;
  }
  constructor(props) {
    super(props);
    this.state = {
      shouldRender: false,
    };
  }

  componentDidMount() {
    // prettier-ignore
    this.setState({ // eslint-disable-line
      shouldRender: FeatureFlag.IS_FEATURE,
    });
  }
  render() {
    return this.state.shouldRender ? this.props.children : <span />;
  }
}

FeatureFlag.propTypes = {
  children: PropTypes.element.isRequired,
};
FeatureFlag.IS_FEATURE = null;
export default FeatureFlag;
