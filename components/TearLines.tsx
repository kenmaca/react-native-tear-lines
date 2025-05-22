import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";

// defaults
export const DEFAULT_TEAR_SIZE = 10; // Exported for testing
const DEFAULT_TEAR_COLOR = "#FFFFFF";
const DEFAULT_BACKGROUND_COLOR = "#CCCCCC";

interface TearLinesProps {
  isUnder?: boolean;
  tearSize?: number;
  color?: string;
  backgroundColor?: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string; // Added from a previous subtask, ensure it's included
}

const TearLines: React.FC<TearLinesProps> = (props) => {
  const {
    tearSize: propsTearSize,
    isUnder,
    style,
    color: propsColor,
    backgroundColor: propsBackgroundColor,
    width: propsWidth,
    testID,
  } = props;

  const [layoutWidth, setLayoutWidth] = useState<number>(0);

  // Effect to handle propsWidth changes, similar to UNSAFE_componentWillReceiveProps
  // This logic was part of the original functional component refactor, adapting it here.
  // If propsWidth is provided, it should override layoutWidth.
  // If propsWidth becomes undefined, we should rely on layoutWidth.
  // However, the primary mechanism for width is: use propsWidth if defined, else use layoutWidth.
  // The functional component refactor in subtask 4 handled this by choosing `effectiveWidth`.
  // `UNSAFE_componentWillReceiveProps` was:
  // next.width != this.props.width && this.setState({ width: next.width });
  // This implies if a prop `width` is passed, it's used. If it changes, the internal state `width` (now `layoutWidth` or part of `effectiveWidth` logic) updates.
  // The new functional approach uses `effectiveWidth` which already prioritizes `propsWidth`.
  // The `onLayout` updates `layoutWidth` only if `propsWidth` is not defined.
  // So, direct synchronization like in `UNSAFE_componentWillReceiveProps` is subtly handled.

  const effectiveWidth = propsWidth !== undefined ? propsWidth : layoutWidth;

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (propsWidth === undefined) {
        // Only set layoutWidth if props.width is not provided,
        // allowing dynamic width calculation.
        setLayoutWidth(event.nativeEvent.layout.width);
      }
    },
    [propsWidth] // Dependency: if propsWidth changes, this callback might behave differently
                 // (though its direct logic doesn't change, its conditionality on propsWidth is key)
  );

  const tearSize = useMemo(() => propsTearSize || DEFAULT_TEAR_SIZE, [propsTearSize]);
  const componentColor = useMemo(() => propsColor || DEFAULT_TEAR_COLOR, [propsColor]);
  const componentBackgroundColor = useMemo(() => propsBackgroundColor || DEFAULT_BACKGROUND_COLOR, [propsBackgroundColor]);

  const rawTiles = useMemo(() => {
    if (effectiveWidth <= 0 || tearSize <= 0) return 0;
    return effectiveWidth / tearSize;
  }, [effectiveWidth, tearSize]);

  const numTiles = useMemo(() => {
    return Math.ceil(rawTiles);
  }, [rawTiles]);

  const offset = useMemo(() => {
    if (numTiles === 0 || tearSize === 0) return 0;
    return ((numTiles - rawTiles) * tearSize) / 2;
  }, [numTiles, rawTiles, tearSize]);

  const margin = useMemo(() => {
    return -(tearSize * 1.5) / 2;
  }, [tearSize]);

  const tilesArray = useMemo(() => {
    return Number.isFinite(numTiles) && numTiles > 0
      ? new Array(numTiles).fill(null)
      : [];
  }, [numTiles]);

  return (
    <View
      testID={testID || "tear-lines-container"} // Ensure testID is passed
      onLayout={onLayout}
      style={[
        styles.container,
        isUnder ? { marginTop: margin } : { marginBottom: margin },
        style,
      ]}
    >
      <View
        style={[
          styles.ends,
          // styles.leftEnds, // Not present in original class styles, but often typical for such components
          {
            width: tearSize,
            height: tearSize * 1.5,
            backgroundColor: componentBackgroundColor,
          },
          { marginRight: -offset }, // Corrected from original, ensure it's not causing issues
        ]}
      />
      {tilesArray.map((_, i) => (
        <View
          key={`tear-${i}`}
          testID="tear-line-segment" // Added for testing
          style={[
            styles.tear,
            {
              width: tearSize,
              height: tearSize,
              backgroundColor: componentColor,
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.ends,
          // styles.rightEnds, // Not present in original class styles
          {
            width: tearSize,
            height: tearSize * 1.5,
            backgroundColor: componentBackgroundColor,
          },
          { marginLeft: -offset }, // Corrected from original
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
    zIndex: -1, // from original
  },
  tear: {
    // width: DEFAULT_TEAR_SIZE, // these are now dynamic
    // height: DEFAULT_TEAR_SIZE,
    // backgroundColor: DEFAULT_TEAR_COLOR,
    transform: [{ rotate: "45deg" }],
  },
  ends: {
    // width: DEFAULT_TEAR_SIZE, // dynamic
    // height: DEFAULT_TEAR_SIZE * 1.5, // dynamic
    // backgroundColor: DEFAULT_BACKGROUND_COLOR,
    zIndex: 100, // from original
  },
  // Specific end styles if needed, e.g., for different border radii on corners
  // leftEnds: {},
  // rightEnds: {},
});

export default TearLines;
