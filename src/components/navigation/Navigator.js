//@flow

import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator
} from "react-navigation";
import { connect } from "react-redux";
import React from "react";
import Devices from "../screens/Devices";
import Device2step from "../screens/Device2step";
import { createReduxBoundAddListener } from "react-navigation-redux-helpers";
import type { Dispatch } from "../../types/Dispatch";
import QRScanner from "../screens/QRScanner";
import Resources from "../screens/Resources";
import DeviceInfo from "../screens/DeviceInfo";
import Chart from "../screens/Chart";
import Menu from "../screens/MenuList";
import ShowQR from "../screens/ShowQR";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import {
//   COLOR_TAB_BAR_ACTIVE,
//   COLOR_TAB_BAR_INACTIVE
// } from "../../constants/ThingerColors";
import UserDevices from "../screens/User";
import UserSettings from "../screens/UserSettings";


export const Routes = StackNavigator(
  {
    Main: { screen: Devices, key: "Main" },
    Menu: {  screen: Menu},
    Scanner: { screen: QRScanner },
    Settings: { screen: UserSettings },
    Device2step: { screen: Device2step },
    Device: { screen: Resources },
    Info: { screen: DeviceInfo },
    Chart: { screen: Chart },
    ShowQR: { screen: ShowQR }
  },
  {
    headerMode: "none",
    cardStyle: {
      shadowOpacity: 0
    }
  }
);

type Props = {
  // isLogged: boolean,
  dispatch: Dispatch,
  nav: any
};

//rendered root in component
class Navigator extends React.Component<Props> {
  render() {
    const { dispatch, nav } = this.props;
    const addListener = createReduxBoundAddListener("root");
    return (
      <Routes
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
          isLogged:true //this.props.isLogged
        })}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    // isLogged: state.login.isLogged,
    nav: state.nav
  };
};

export default connect(mapStateToProps)(Navigator);
