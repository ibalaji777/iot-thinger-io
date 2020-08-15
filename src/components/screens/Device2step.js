//@flow

import { connect } from "react-redux";
import {
  FlatList,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Clipboard,
  Text,
  TouchableWithoutFeedback,
  Alert ,
  BackHandler 
} from "react-native";
import DeviceComponent from "../devices/DeviceComponent";
import React from "react";
import { MARGIN } from "../../constants/ThingerStyles";
import Screen from "../containers/Screen";
import { navigate } from "../../actions/nav";
import { getResourcesFromApi } from "../../actions/fetch";
import { addDevice, selectDevice,selectGroup } from "../../actions/device";
import { removeAllResources } from "../../actions/resource";
import type { Dispatch } from "../../types/Dispatch";
import NavigationBar from "../navigation/NavigationBar";
import type { Device } from "../../types/Device";
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import ID from "../../constants/GoogleAnalytics";
import H1Text from "../texts/H1";
import H2Text from "../texts/H2";
import { DARK_BLUE } from "../../constants/ThingerColors";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialIcons";
import { parseJWT } from "../../utils/jwt";
import { ToastActionsCreators } from "react-native-redux-toast";

type Props = {
  ids: Array<string>,
  devices: Array<Device>,
  onDeviceClick: (device: Device) => Dispatch,
  onQRScannerPress: () => Dispatch,
  onAddDevice: (device: Device) => Dispatch,
  onSettingsPress: () => Dispatch,
  isUserDevices: boolean,
  isFetching: boolean,
  displayMessage: (message: string) => Dispatch,
  displayError: (message: string) => Dispatch
};

class DevicesStep2Screen extends React.Component<Props> {
  constructor(props) {
    super(props);
    new GoogleAnalyticsTracker(ID).trackScreenView("Main");

    console.debug("--------------contructor device2step-----------")
    console.debug(props.devices)
    let checkGroupExist=obj=>obj.group==props.group.group;
var isGroupExist=(props.devices).some(checkGroupExist);
console.debug(isGroupExist)
    this.state={
      group_image:'',
      isGroupExist:isGroupExist,
    }
  }
  handleBackButton = () => {

    this.props.Goback();
  
    return true;
  } 
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  
   componentWillReceiveProps(){
    let checkGroupExist=obj=>obj.group==this.props.group.group;
    var isGroupExist=(this.props.devices).some(checkGroupExist);
    console.debug(isGroupExist)
        this.setState({
  
          isGroupExist:isGroupExist,
        })
  
  }
 



  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  onClipboardButtonPress = async () => {
    const {
      ids: devices,
      onAddDevice,
      displayMessage,
      displayError
    } = this.props;

    try {
      const token = await Clipboard.getString();
      const device = parseJWT(token);
      const id = Object.keys(device)[0];
      var keys = Object.keys( device );
      device[keys[0]]["group"]=group_name;
      if (devices.includes(id)) {
        displayError("This device already exists");
      } else {
        onAddDevice(device);
        displayMessage("Added!");
      }
    } catch (e) {
      displayError("This QR isn't a device");
    }
  };

//newly added function 
  group_iot = ({ item }) => (
    <View style={{ flex: 1, marginHorizontal: 5, marginBottom: 20,shadowColor: 'red',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 10,  
    elevation: 15 }}>
      <Image
        style={{ width: "100%", height: 180 }}
        
        source={this.switch_group(item.group)}
      />

<View   style={{ justifyContent:'center',alignItems:'center', position:"absolute",borderRadius :50,backgroundColor:item.top_icon_bg_color, top:5,left:5, width: 60, height: 60,overflow:"hidden", }}>
<Image
        style={{  width: 30, height: 30 ,zIndex: 500 }}
        source={this.switch_group(item.group)}
      />
    
</View>
<Text style={{ position:"absolute",fontSize:12,fontWeight: '900',   textAlign: "center", marginTop: 8,bottom:10,left:10 }}>{item.title}</Text>
<View   style={{ justifyContent:'center',alignItems:'center',fontSize:18,fontWeight: "bold", position:"absolute",borderRadius :50,backgroundColor:'rgba(211, 211, 211, 0.4)', bottom:10,right:5, width: 45, height: 45,shadowColor: 'red',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 10,  
    elevation: 15 }}>  
<Text style={{fontSize:20,zIndex: 500,fontWeight:'900'}}>></Text>
</View>
    </View>
  );


  renderContent() {
    const {
      devices,
      onDeviceClick,
      isUserDevices,
      onQRScannerPress
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        
        {this.state.isGroupExist
          ? (
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>{
            if(item.group==this.props.group.group){
              return (

              <DeviceComponent
                name={item.name ? item.name : item.dev}
                user={item.usr}
                all={item}
                onClick={() => onDeviceClick(item)}
              />
            )}}}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../../assets/no_devices.png")}
              style={{ height: 100, width: 100, margin: MARGIN * 2 }}
            />
            <H1Text>Ooops!</H1Text>
            <H2Text>You could add a device...</H2Text>
          </View>
        )}

        {!isUserDevices && (
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="from clipboard"
              onPress={this.onClipboardButtonPress}
            >
              <Icon name="content-paste" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            <ActionButton.Item
              buttonColor="#1abc9c"
              title="from QR scanner"
              onPress={onQRScannerPress}
            >
              <Icon name="photo-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        )}
      </View>
    );
  }

  render() {
    const { isFetching, isUserDevices, onSettingsPress } = this.props;

    return (
      <Screen
      navigationBar={
        <NavigationBar
          title={"Togle"}
                />
      }
    >

        {isFetching ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color={DARK_BLUE} />
          </View>
        ) : (
          this.renderContent()
        )}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 22,
    height: 22,
    color: "white"
  }
});

const mapStateToProps = state => {

  const isUserDevices: boolean = false;
  
console.log("---------------------device2step----------------")
console.log(state)

  return {

    group:state.selectedGroup,
    ids: Object.keys(state.devices),
    devices: isUserDevices
      ? (Object.values(state.devices): any).filter(device =>
          state.userDevices.includes(device.id)
        )
      : (Object.values(state.devices): any).filter(
          device => !state.userDevices.includes(device.id)
        ),
    isUserDevices,
    isFetching: state.login.isFetching
  };
};

const mapDispatchToProps = dispatch => {
  return {
    Goback:()=>{
      dispatch({type:'Navigation/BACK'})
    },
    onDeviceClick: device => {
      dispatch(removeAllResources());
      dispatch(selectDevice(device.id));
      dispatch(getResourcesFromApi(device));
      dispatch(navigate("Device"));
    },
    onSettingsPress: () => dispatch(navigate("Settings")),
    onQRScannerPress: () =>{ 

      console.log("-----qr scanner device2step----------")
      // dispatch(selectGroup(this.props.group));          
      console.log(dispatch)    
      dispatch(navigate("Scanner"))
      // this.forceUpdate();

  },
    onAddDevice: (device: Device) => dispatch(addDevice(device, false)),
    displayMessage: (message: string) =>
      dispatch(ToastActionsCreators.displayInfo(message, 1000)),
    displayError: (message: string) =>
      dispatch(ToastActionsCreators.displayError(message, 1000))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DevicesStep2Screen);
