import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseStyle from '../../../styles/Base';

const RowTable = ({ leftWidth = '50%', rightWidth = '50%', leftText, rightText, type, fontSize = 14, marginBottom = 10 }) => {
    return (
      <View style={{ ...BaseStyle.container5, marginBottom  }}>
        <View style={{ width: leftWidth }}>
          <Text style={[{ textAlign: 'left', fontSize, ...BaseStyle.font_222 }, type === 'bold' && {...BaseStyle.font_bold}, fontSize === 14 && {...BaseStyle.lh17}]}>
						{leftText}
          </Text>
				</View>
				<View style={{ width: rightWidth }}>
					<Text style={[{ textAlign: 'right', fontSize, ...BaseStyle.font_333 }, type === 'bold' && {...BaseStyle.font_bold}, fontSize === 14 && {...BaseStyle.lh17}]}>
						{rightText}
					</Text>
				</View>
      </View>
    );
}

const styles = StyleSheet.create({})

export default RowTable;
