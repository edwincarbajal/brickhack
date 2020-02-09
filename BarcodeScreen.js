import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';

import { BarCodeScanner } from 'expo-barcode-scanner';
const { width: winWidth, height: winHeight } = Dimensions.get('window');

class BarcodeScreen extends Component {
  state = {
    hasPermission: null,
    setHasPermission: null,
    scanned: false,
    setScanned: false
  }

  async componentDidMount() {
    const barcode = await BarCodeScanner.requestPermissionsAsync();
    const hasPermission = (barcode.status == 'granted')
    this.setState({ hasPermission });
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({setScanned: true})
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  render() {
    return (
      <BarCodeScanner
        onBarCodeScanned = { this.state.scanned ? undefined : this.handleBarCodeScanned }
        style = {{
          height:  winHeight,
          width: winWidth,
        }}
      >
      </BarCodeScanner>
    );
  }
}
export default BarcodeScreen;
