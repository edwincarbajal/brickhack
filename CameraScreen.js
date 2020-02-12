import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image,SafeAreaView   } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import ToggleSwitch from 'toggle-switch-react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
const { width: winWidth, height: winHeight } = Dimensions.get('window');

import Toolbar from './components/Toolbar';
import Gallery from './components/Gallery';
import Toggle from './components/Toggle';
import BarcodeScreen from './BarcodeScreen';

class CameraScreen extends Component {
  camera = null;
  state = {
    toggle: false,
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

  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync({base64: true});
    this.setState({ path: photoData.uri, capturing: false, captures: [photoData, ...this.state.captures] });
    let body = JSON.stringify({
      requests: [
        {
          'features': [
            {
              'type': 'LABEL_DETECTION',
              "maxResults": 1,
            }
          ],
          "image": {
            "content": photoData.base64
          },
        }
      ]
    });
    let response = await fetch(
     `https://vision.googleapis.com/v1/images:annotate?key=${(REACT_GOOGLE_VISION_API_KEY}`,
     {
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json"
       },
       method: "POST",
       body: body
     }
   );
   let responseJson = await response.json();
   console.log(responseJson)
  };

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const barcode = await BarCodeScanner.requestPermissionsAsync();
    const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted' && barcode.status === 'granted');
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
        <Toggle>
          <ToggleSwitch
            isOn={this.state.toggle}
            onColor="green"
            offColor="red"
            label=""
            onToggle={isOn => this.setState({toggle: isOn})}
          />
        </Toggle>
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
        {this.state.toggle ?
          this.state.path ? this.renderImage() : <BarcodeScreen /> :
          this.state.path ? this.renderImage() : this.renderCamera()
        }
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
