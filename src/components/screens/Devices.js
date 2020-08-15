//@flow

import { connect } from "react-redux";
import Modal from 'react-native-modal';


import  Groupdialog  from './group'
import {
  FlatList,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Clipboard,
  Text,
  TouchableWithoutFeedback ,
  TouchableOpacity,
  TextInput ,
  Alert ,
  BackHandler
} from "react-native";
import DeviceComponent from "../devices/DeviceComponent";
import React from "react";
import { MARGIN } from "../../constants/ThingerStyles";
import Screen from "../containers/Screen";
import { navigate } from "../../actions/nav";
import { getResourcesFromApi } from "../../actions/fetch";
import { addDevice, selectDevice,selectGroup,groupDialogOn } from "../../actions/device";
import { removeAllResources } from "../../actions/resource";
import type { Dispatch } from "../../types/Dispatch";
import NavigationBar from "../navigation/NavigationBar";
import type { Device } from "../../types/Device";
// import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
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
  // onGroupClick: (device:Device) => Dispatch,
  onDeviceClick: (device: Device) => Dispatch,
  onQRScannerPress: () => Dispatch,
  onAddDevice: (device: Device) => Dispatch,
  onSettingsPress: () => Dispatch,
  isUserDevices: boolean,
  isFetching: boolean,
  displayMessage: (message: string) => Dispatch,
  displayError: (message: string) => Dispatch
};

class DevicesScreen extends React.Component<Props,State> {
  constructor(props) {
    super(props);
    // new GoogleAnalyticsTracker(ID).trackScreenView("Main");
    this.state={
      group_image:'',
      group_name:'',
      group_dialog:false
    };
    console.log("--------screnn devices constructor props--------")
    console.log(props);
  }


  handleBackButton = () => {

   Alert.alert(
       'Exit Togle App',
       'Exiting the Togle application?', [{
           text: 'Cancel',
           onPress:function(){ console.log('Cancel Pressed')},
           style: 'cancel'
       }, {
           text: 'OK',
           onPress: function(){ BackHandler.exitApp()}
       }, ], {
           cancelable: false
       }
    )
    return true;
  } 
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

   addGroup=()=>{
  
      console.log(this.state.group_name)
     }
    
GroupName=(input)=>{
  this.setState({
   group_name:input
  })
  console.log(this.state.group_name)
 }
 
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
  group_iot = ({ item ,index}) => (
    <View        style={{ width:'47%', marginHorizontal: 5, marginBottom: 15,shadowColor: 'red',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 10,  
    elevation: 15 }}>
      <TouchableOpacity onLongPress={()=>this.props.onGroupDialogRemoveOn(item,index)} onPress={()=>this.props.onGroupClick(item)}>  
          <Image
        style={{ width: "100%", height: 180 }}
        source={item.image}

      />


    <View style={{backgroundColor:"rgba(255,255,255,0.50)", position:"absolute",fontSize:12,fontWeight: '900',   textAlign: "center", marginTop: 8,bottom:10,left:10 }}>
<Text >{item.title}</Text>
</View>

</TouchableOpacity>
    </View>
  );



  renderContent() {
    const {
      devices,
   
      onDeviceClick,
      isUserDevices,
      onQRScannerPress,
      group
    } = this.props;

    return (
      <View style={{ flex: 1 }}>

      <Groupdialog group_dialog={this.state.group_dialog}/>
         <Text style={{color:'#0080FF',fontWeight:'bold',fontSize:14,marginLeft:4,marginTop:4}}>FAVORITES</Text>
         <FlatList
          data={group}
          renderItem={(item,index)=>this.group_iot(item,index)}
          keyExtractor={item => item.id}
          numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20 }}
        />


          <ActionButton buttonColor="rgba(231,76,60,1)">

            <ActionButton.Item
              buttonColor="#9b59b6"
              title="Add Group"
              onPress={()=>{ this.props.onGroupDialogActivatorOn() }}
            >
             
              <Icon name="content-paste" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            
 
          </ActionButton>
        {/* )} */}
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
            main={true}
            button={
              isUserDevices
                ? {
                    icon: "ellipsis-v",
                    onPress: onSettingsPress
                  }
                : undefined
            }
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
  console.log("-----------screen devices------------");
  console.log(state.group.groups);
  const isUserDevices: boolean = true;

  return {
    group:state.group.groups,
    groupDialog:state.groupDialogControl.groupDialogControl,
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
    onGroupDialogRemoveOn:(item,index)=>{
    dispatch({type:"GroupDialogItemIndex",index:index})
     dispatch({type:"GroupDialogRemoveOn"})
     dispatch(selectGroup(item.group));
    },
    onGroupDialogActivatorOn:()=>{
      dispatch(groupDialogOn("on"));
    },
    onGroupClick: group => {
      console.log("----------group id---------------");
      dispatch(removeAllResources());
      dispatch(selectGroup(group));
      dispatch(navigate("Device2step"));

    },
    onDeviceClick: device => {
      console.log("----------device info---------------");
      console.log(removeAllResources());
      dispatch(removeAllResources());
      console.log(selectDevice(device.id));
      dispatch(selectDevice(device.id));
      console.log(getResourcesFromApi(device));
      dispatch(getResourcesFromApi(device));
      console.log(navigate("Device"));
      dispatch(navigate("Device"));
    },
    onSettingsPress: () => dispatch(navigate("Menu")),
    onQRScannerPress: () => dispatch(navigate("Scanner")),
    onAddDevice: (device: Device) => dispatch(addDevice(device, false)),
    displayMessage: (message: string) =>
      dispatch(ToastActionsCreators.displayInfo(message, 1000)),
    displayError: (message: string) =>
      dispatch(ToastActionsCreators.displayError(message, 1000))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DevicesScreen);
