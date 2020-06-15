//@flow

import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { PADDING } from "../../constants/ThingerStyles";
import { parseJWT } from "../../utils/jwt";
import Screen from "../containers/Screen";
import type { Dispatch } from "../../types/Dispatch";
import { addDevice } from "../../actions/device";
import { goBack } from "../../actions/nav";
import NavigationBar from "../navigation/NavigationBar";
import { RNCamera } from "react-native-camera";
import { DARK_BLUE } from "../../constants/ThingerColors";
import { ToastActionsCreators } from "react-native-redux-toast";
import type { Device } from "../../types/Device";

type Props = {
  devices: Array<string>,
  addDevice: (device: Device) => Dispatch,
  displayError: (message: string) => Dispatch
};

type State = {
  scanning: boolean
};

class QRScanner extends React.Component<Props, State> {
  state = {
    scanning: false
  };

  handleOnBarCodeRead(data) {
    const { devices, displayError, addDevice } = this.props;

    this.setState({ scanning: true });

    //device already exist or not (validation)
    try {
      const device = parseJWT(data.data);
      //add group manually here
      const id = Object.keys(device)[0];
      if (devices.includes(id)) {
        console.log(device)
        displayError("This device already exists");
      } else {
        addDevice(device);
      }
      setTimeout(() => this.setState({ scanning: false }), 1000);
    } catch (e) {
      displayError("This QR isn't a device");
      setTimeout(() => this.setState({ scanning: false }), 1000);
    }
  }

  renderCamera() {
    return (
      <RNCamera
        style={{
          flex: 1,
          backgroundColor: "transparent"
        }}
        type={RNCamera.Constants.Type.back}
        permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={
          "We need your permission to use your camera phone"
        }
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        onBarCodeRead={data => {
          if (!this.state.scanning) this.handleOnBarCodeRead(data);
        }}
      />
    );
  }

  render() {
    return (
      <Screen navigationBar={<NavigationBar title="QR Scanner" />}>
        {this.renderCamera()}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: PADDING,
            backgroundColor: DARK_BLUE
          }}
        >
          <Text style={{ color: "white" }}>Scan your device token QR</Text>
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  console.log("------------ from QR scanner-------------")
  console.log(state);
  return {
    devices: Object.keys(state.devices),
    group:state.selectedGroup
  };
};

const mapDispatchToProps = dispatch => {
  console.log("---------from dispatch qr scanner----------")
  return {
    addDevice: (device: Device) => {
      console.log("device added");
      console.log(device)
      dispatch(addDevice(device, false));
      dispatch(ToastActionsCreators.displayInfo("Added!", 1000));
      return dispatch(goBack());
    },
    displayError: (message: string) =>
      dispatch(ToastActionsCreators.displayError(message, 1000))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QRScanner);
