import React from "react";
import {
  View, StyleSheet
} from "react-native";
import PropTypes from "prop-types";

// defaults
const DEFAULT_TEAR_SIZE = 10;
const DEFAULT_TEAR_COLOR = "#FFFFFF";
const DEFAULT_BACKGROUND_COLOR = "#CCCCCC";

export default class TearLines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };

    // bindings
    this.onLayout = this.onLayout.bind(this);
  }

  componentWillReceiveProps(next) {

    // allow width to be passed in via props too if not
    // dynamically calculated by onLayout
    next.width != this.props.width && this.setState({
      width: next.width
    });
  }

  onLayout(event) {
    this.setState({ width: event.nativeEvent.layout.width });
  }

  get tiles() {
    return Math.ceil(this._rawTiles);
  }

  get _rawTiles() {
    return this.state.width
      / (this.props.tearSize || DEFAULT_TEAR_SIZE);
  }

  get offset() {
    return (this.tiles - this._rawTiles)
      * (this.props.tearSize || DEFAULT_TEAR_SIZE)
      / 2;
  }

  render() {

    // used to offset the tear lines halfway under
    // the "attached container"
    const margin = -(this.props.tearSize || DEFAULT_TEAR_SIZE)
      * 1.5
      / 2;
    return (
      <View style={[
        styles.container,
        this.props.isUnder ? {
          marginTop: margin
        }: {
          marginBottom: margin
        }, this.props.style]}>
        <View style={[styles.ends, styles.leftEnds, this.props.tearSize && {
          width: this.props.tearSize,
          height: this.props.tearSize * 1.5
        }, this.props.backgroundColor && {
          backgroundColor: this.props.backgroundColor
        }, {
          marginRight: -this.offset
        }]} />
        {(new Array(this.tiles)).fill().map((e, i) => <View
          key={`tear-${i}`}
          style={[styles.tear, this.props.tearSize && {
            width: this.props.tearSize,
            height: this.props.tearSize
          }, this.props.color && {
            backgroundColor: this.props.color
          }]} />)}
        <View style={[styles.ends, styles.rightEnds, this.props.tearSize && {
          width: this.props.tearSize,
          height: this.props.tearSize * 1.5,
        }, this.props.backgroundColor && {
          backgroundColor: this.props.backgroundColor
        }, {
          marginLeft: -this.offset
        }]} />
      </View>
    );
  }
}

TearLines.propTypes = {

  // default is tears facing up, isUnder will invert (used
  // at buttom of attached container)
  isUnder: PropTypes.bool,

  // sizes of each individual diagonal tear
  tearSize: PropTypes.number,

  // should match the foreground of attached container
  color: PropTypes.string,

  // should match the background for the TearLines
  backgroundColor: PropTypes.string,

  // generally not used, as width should be calculated
  // on the fly with onLayout
  width: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",

    // under attached container
    zIndex: -1
  },

  tear: {
    width: DEFAULT_TEAR_SIZE,
    height: DEFAULT_TEAR_SIZE,
    backgroundColor: DEFAULT_TEAR_COLOR,
    transform: [{
      rotate: "45deg"
    }]
  },

  ends: {
    width: DEFAULT_TEAR_SIZE,
    height: DEFAULT_TEAR_SIZE * 1.5,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    zIndex: 100
  }
});
