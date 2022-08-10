import { View, Text } from 'react-native'
import React from 'react'
import AnimateLoading from '../components/AnimateLoading'

const Layout = ({ isLoading, child, props }) => {
  console.log('Layout isLoading', isLoading)
  console.log('Layout child', child)
  console.log('Layout props', props)

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}
      {!isLoading && <>{child}</>}
    </>
  )
}

export default Layout
