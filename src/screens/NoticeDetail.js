import * as React from 'react'
import { View, Text, Image, useWindowDimensions, ScrollView } from 'react-native'
import HTML from 'react-native-render-html'
import Header from '../components/Header'
import BaseStyle from '../styles/Base'
import Api from '../Api'
import AnimateLoading from '../components/AnimateLoading'

const NoticeDetail = props => {
  const { navigation } = props
  const { item } = props.route.params

  const contentWidth = useWindowDimensions().width

  const [detail, setDetail] = React.useState('')
  const [isLoading, setLoading] = React.useState(true)

  const getNoticeDetailHandler = payload => {
    const param = {
      encodeJson: true,
      bo_table: 'notice',
      wr_id: payload
    }

    Api.send('store_board_detail', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        console.log('====================================')
        console.log('arrItems', arrItems)
        console.log('====================================')
        setDetail(arrItems)
      } else {
        setDetail(arrItems)
      }

      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getNoticeDetailHandler(props.route.params.item.wr_id)
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='공지사항' />
          <View
            style={{
              ...BaseStyle.ph20,
              ...BaseStyle.pv20,
              ...BaseStyle.container5,
              alignItems: 'flex-start'
            }}
          >
            <View style={{ marginTop: -2 }}>
              <Text
              style={{
              ...BaseStyle.ko18,
              ...BaseStyle.font_bold,
              ...BaseStyle.lh24,
              ...BaseStyle.mb10
            }}
            >
              제목 : {detail.subject}
            </Text>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>
              작성일자 : {detail.datetime}
            </Text>
            </View>
            <View style={{ ...BaseStyle.container }}>
              <Image
              source={require('../images/eye.png')}
              style={{ width: 20, height: 17, ...BaseStyle.mr5 }}
              resizeMode='contain'
            />
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>{detail.wr_hit}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#e5e5e5' }} />
          {detail.content && (
            <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv10, flex: 1 }}>
              <ScrollView>
              <HTML
              source={{ html: detail.content }}
              contentWidth={contentWidth}
              imagesInitialDimensions={{ width: 100, height: 100 }}
            />
            </ScrollView>
            </View>
          )}
        </View>}
    </>
  )
}

export default NoticeDetail
