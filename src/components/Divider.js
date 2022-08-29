import React from 'react'
import { View, StyleSheet } from 'react-native'

const Divider = ({ height = 1, backgroundColor = '#ececec' }) => {
  return (
    <View style={styles(height, backgroundColor).line} />
  )
}

const styles = (height, background) => StyleSheet.create({
  line: {
    height: height,
    width: '100%',
    backgroundColor: background
  }
})

export default Divider
