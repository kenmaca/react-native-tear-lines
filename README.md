# react-native-tear-lines
Zig-zag borders to simulate tear lines normally seen on receipts.

<IMG SRC="https://github.com/kenmaca/react-native-tear-lines/blob/master/demo.png" width="200" />

## Installation

```
yarn add react-native-tear-lines
```

## Usage

Use `TearLines`'s `onLayout` method in the attached component's `onLayout` prop
to dynamically match it's width like demonstrated below:

```js
import { View } from "react-native";
import TearLines from "react-native-tear-lines";

<View style={{ backgroundColor: "#CCCCCC" }}>
  <TearLines
    ref="top"
    color="#FFFFFF"
    backgroundColor="#CCCCCC">
  <View
    style={{ backgroundColor: "#FFFFFF" }}
    onLayout={e => {
      this.refs.top.onLayout(e);
      this.refs.bottom.onLayout(e);
    }} />
  <TearLines
    ref="bottom"
    color="#FFFFFF"
    backgroundColor="#CCCCCC">
</View>
```

## Properties

| Prop | Description | Default | Required |
|---|---|---|---|
|**`color`**|Foreground color; should match attached content view's background color.|`#FFFFFF`|No|
|**`backgroundColor`**|Background color, should match container's background color.|`#CCCCCC`|No|
|**`tearSize`**|Specifies how large each tear tile is. Larger values will render less tiles.|`10`|No|
|**`width`**|Width can be provided if you don't want to use the `onLayout` method to dynamically match the attached content view.|*None*|No|

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Kenneth Ma
