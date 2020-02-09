import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image  } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
const { width: winWidth, height: winHeight } = Dimensions.get('window');

import Toolbar from './Toolbar';
import Gallery from './Gallery';

class CameraScreen extends React.Component {
  camera = null;
  state = {
    path: null,
    captures: [],
    // setting flash to be turned off by default
    flashMode: Camera.Constants.FlashMode.off,
    capturing: null,
    // start the back camera by default
    cameraType: Camera.Constants.Type.back,
    hasCameraPermission: null,
  };

  setFlashMode = (flashMode) => this.setState({ flashMode });
  setCameraType = (cameraType) => this.setState({ cameraType });
  handleCaptureIn = () => this.setState({ capturing: true });

  handleCaptureOut = () => {
    if (this.state.capturing)
      this.camera.stopRecording();
  };

  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync();
    this.setState({ path: photoData.uri, capturing: false, captures: [photoData, ...this.state.captures] });
    console.log(this.state.captures);
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');
    this.setState({ hasCameraPermission });
  };

  renderCamera() {
    const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;
    return(
      <Camera
        type={cameraType}
        flashMode={flashMode}
        style={styles.preview}
        ref={camera => this.camera = camera}
      >
        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          onShortCapture={this.handleShortCapture}
        />
      </Camera>
    )
  }

  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.path }}
          style={styles.preview}
        />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ path: null })}
        >
          Cancel
        </Text>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }
    return (
      <View>
        {this.state.path ? this.renderImage() : this.renderCamera()}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  preview: {
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

export default CameraScreen;
