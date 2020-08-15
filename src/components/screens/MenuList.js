import React, { Component } from 'react';
import { connect } from "react-redux";
import Screen from "../containers/Screen";
import NavigationBar from "../navigation/NavigationBar";
import Communications from 'react-native-communications';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  BackHandler 
} from 'react-native';
 class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calls: [
        {id:1, action:"support",  name: "Call Support",   image:require('./../../assets/c.png')},
        {id:2, action:"email",  name: "Email",  image:require('./../../assets/g.jpg')} ,
        {id:2, action:"web",title:'Facebook', value:'https:www.facebook.com/togleautomation',  name: "Email",   image:require('./../../assets/f.jpg')} ,
 
        {id:2, action:"web",title:'Instagram', value:'https:instagram.com/togleautomation', name: "Email",   image:require('./../../assets/i.jpg')} ,
 
      ]
    };
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

  renderItem = ({item}) => {
    var callIcon = "https://img.icons8.com/color/48/000000/phone.png";
    if(item.video == true) {
      callIcon = "https://img.icons8.com/color/48/000000/video-call.png";
    }

    if(item.action=="support"){
    return (
      // <TouchableOpacity>
        <View style={styles.row}>
          <Image source={ item.image } style={styles.pic} />
          <View>
            <View style={{flexDirection:'column'}}>
              {/* <Image style={[styles.icon, {marginLeft:15, marginRight:5, width:14, height:14}]} source={{uri:"https://img.icons8.com/small/14/000000/double-tick.png"}}/> */
              }
             <TouchableOpacity onPress={() => Communications.phonecall('9094599578', true)}>
                <View style={styles.holder}>
                  <Text style={styles.text}>9094599578</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Communications.phonecall('7397339857', true)}>
                <View style={styles.holder}>
                  <Text style={styles.text}>7397339857</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Communications.phonecall('8838727415', true)}>
                <View style={styles.holder}>
                  <Text style={styles.text}>8838727415</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
          {/* <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: callIcon}}/> */}
        </View>
      // </TouchableOpacity>
    );
    }


    
    if(item.action=="email"){
        return (
            <View style={styles.row}>
              <Image source={ item.image } style={styles.pic_g} />
              <View>
           
                <View style={styles.end,{flexDirection:'column'}}>
                <TouchableOpacity onPress={() => Communications.email(['toglehome@gmail.com'],null,null,'Togle App','')}>
          <View style={styles.holder}>
            <Text style={styles.text}>toglehome@gmail.com</Text>
          </View>
        </TouchableOpacity>


                </View>
              </View>
            </View>
         );
        }

            
    if(item.action=="web"){
        return (
             <View style={styles.row}>
              <Image source={ item.image } style={styles.pic} />
              <View>
               
                <View style={styles.end,{flexDirection:'column'}}>
           
                <TouchableOpacity onPress={() => Communications.web(item.value)}>
          <View style={styles.holder}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => Communications.web()}>
          <View style={styles.holder}>
            <Text style={styles.text}>FaceBook</Text>
          </View>
        </TouchableOpacity> */}


                </View>
              </View>
           
            </View>
        
        );
        }

  }

  render() {
    return(
        <Screen
        navigationBar={
          <NavigationBar
            title={"Togle"}
           
            button={
              false
                ? {
                    icon: "cog",
                    onPress: onSettingsPress
                  }
                : undefined
            }
          />
        }
        >
  
      <View style={{ flex: 1 }} >
        <FlatList 
          extraData={this.state}
          data={this.state.calls}
          keyExtractor = {(item) => {
            return item.id;
          }}
          renderItem={this.renderItem}/>
      </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    // justifyContent: 'space-between',

  },
  pic_g: {
    // borderRadius: 25,
    width: 60,
    height: 50,
    marginRight:20,
  },

  pic: {
    // borderRadius: 25,
    width: 50,
    height: 50,
    marginRight:20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 270,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,

  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,

  },
  icon:{
    height: 28,
    width: 28, 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(253,253,253)',
  },
  holder: {
    flex: 0.25,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
})
const mapStateToProps = state => {
  // const { routes: tabs, index: selectedTab } = state.nav.routes[0];
  // const currentTab = tabs[selectedTab].routeName;
  // const isUserDevices: boolean = currentTab === "UserDevices";
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Menu);
  