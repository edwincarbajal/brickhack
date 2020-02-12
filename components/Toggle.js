import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Col, Row, Grid } from "react-native-easy-grid";
const { width: winWidth, height: winHeight } = Dimensions.get('window');

const Toggle = props => (
  <Grid style={styles.topToolbar}>
    <Row>
      <Col size={2} style={styles.alignCenter}>
        {props.children}
      </Col>
    </Row>
  </Grid>
)

const styles = StyleSheet.create({
  alignCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
    topToolbar: {
      width: winWidth,
      position: 'absolute',
      height: 100,
      top: 0,
  },
});
export default Toggle;
