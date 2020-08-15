//@flow

import { connect } from "react-redux";
import { ActivityIndicator, View,Text } from "react-native";
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { DARK_BLUE } from "../../constants/ThingerColors";
import NavigationBar from "../navigation/NavigationBar";
import Screen from "../containers/Screen";
import {
  getResourceFromApi,
  getResourcesFromApi,
  postResource,
  runResource
} from "../../actions/fetch";
import { restartStreaming, selectResource } from "../../actions/resource";
import { navigate } from "../../actions/nav";
import type { Device } from "../../types/Device";
import type { Attribute } from "../../types/Attribute";
import type { ResourcesState } from "../../types/State";
import { isMultipleResource } from "../../types/Resource";
import MultipleResourceView from "../resources/MultipleResource";
import type { MultipleResource, SimpleResource } from "../../types/Resource";
import SimpleResourceView from "../resources/SimpleResource";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

type Props = {
  device: Device,
  resources: ResourcesState,
  onUpdateClick: (device: Device, resource: string) => any,
  onChartClick: (resource: string) => any,
  onGetResources: (device: Device) => any,
  onSettingsClick: () => any,
  onUpdateClick: (resource: string) => any,
  onPostClick: (
    id: string,
    value: Attribute | { [attribute: string]: Attribute }
  ) => any,
  onRun: (id: string) => any
};

type State = {
  pullRefresh: boolean
};

class ResourcesScreen extends React.Component<Props, State> {

  state = {
    pullRefresh: false
  };

  constructor(props) {
    super(props);
    (this: any).onRefresh = this.onRefresh.bind(this);
  }

  async onRefresh() {
    const { onGetResources, device } = this.props;
    await onGetResources(device);
  }

  async onPullRefresh() {
    const { onGetResources, device } = this.props;
    this.setState({ pullRefresh: true });
    await onGetResources(device);
    this.setState({ pullRefresh: false });
  }


  async onRefreshClick() {
    const { onGetResources, device } = this.props;
    this.setState({ pullRefresh: true });
    await onGetResources(device);
    this.setState({ pullRefresh: false });
  }


  renderItem = ({ item }) => {
    const {
      resources,
      onUpdateClick,
      onPostClick,
      onChartClick,
      onRun
    } = this.props;

    if (isMultipleResource(resources[item].data)) {
      const data: MultipleResource = (resources[item].data: any);
      return (
        <View>

        <MultipleResourceView
          resource={item}
          data={data || {}}
          isFetching={resources[item].isFetching && !this.state.pullRefresh}
          onUpdateClick={onUpdateClick}
          onPostClick={onPostClick}
          onChartClick={() => onChartClick(item)}
        />
        </View>
      );
    } else {
      const data: SimpleResource = (resources[item].data: any);
      return (
        <View>

        <SimpleResourceView
          resource={item}
          data={data || {}}
          isFetching={resources[item].isFetching && !this.state.pullRefresh}
          onUpdateClick={onUpdateClick}
          onPostClick={onPostClick}
          onChartClick={() => onChartClick(item)}
          onRun={() => onRun(item)}
        />
        </View>
      );
    }
  };

  renderItemList() {
    const { resources, device } = this.props;

    return (
      <View>

      <KeyboardAwareFlatList
        keyboardOpeningTime={0}
        data={Object.keys(resources)}
        renderItem={this.renderItem}
        keyExtractor={item => item}
        refreshing={device.isFetching}
        onRefresh={(() => this.onPullRefresh(): any)}
      />
      </View>
    );
  }

  render() {
    const { device, onSettingsClick } = this.props;

    return (
      <Screen
        navigationBar={
          <NavigationBar
            title={device ? (device.name ? device.name : device.dev) : "Device"}
            button={{
              icon: "cog",
              onPress: onSettingsClick
            }}
            // settingbutton={{
            //       icon: "refresh",
            //       onPress: (() => this.onRefresh(): any)
            //     }}
          />
        
            // <NavigationBar
            //   title={device ? (device.name ? device.name : device.dev) : "Device"}
            //   button={{
            //     icon: "refresh",
            //     onPress: (() => this.onRefresh(): any)
            //   }}

              

              
            // />)
        }
      >

        

        {device &&
          (device.isFetching && !this.state.pullRefresh ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActivityIndicator size="large" color={DARK_BLUE} />
            </View>
          ) : !device.isOnline ? (
            <ErrorMessage
              message={device.dev + " is offline"}
              icon="plug"
              onPressButton={this.onRefresh}
            />
          ) : !device.hasServerConnection ? (

            // + device.server
            <ErrorMessage
              message={"Couldn't connect device\n"}
              icon="plug"
              onPressButton={this.onRefresh}
            />
          ) : !device.isAuthorized ? (
            // device.usr + 
            <ErrorMessage
              message={" Not authorized User"}
              icon="lock"
              onPressButton={this.onRefresh}
            />
          ) : (
            this.renderItemList()
          ))}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const id = state.selectedDevice;

  return {
    device: state.devices[id],
    resources: state.resources
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateClick: (device, resource) => {
      dispatch(getResourceFromApi(device, resource));
    },
    onPostClick: (device, id, value) =>
      dispatch(postResource(device, id, value)),
    onRun: (device, id) => runResource(device, id),
    onChartClick: resource => {
      dispatch(restartStreaming());
      dispatch(selectResource(resource));
      dispatch(navigate("Chart"));
    },
    onGetResources: device => dispatch(getResourcesFromApi(device)),
    onSettingsClick: () => dispatch(navigate("Info")),
  
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onUpdateClick: resource => {
      const { device } = stateProps;
      dispatchProps.onUpdateClick(device, resource);
    },
    onPostClick: (id, value) => {
      const { device } = stateProps;
      return dispatchProps.onPostClick(device, id, value);
    },
    onRun: id => {
      const { device } = stateProps;
      return dispatchProps.onRun(device, id);
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  ResourcesScreen
);
