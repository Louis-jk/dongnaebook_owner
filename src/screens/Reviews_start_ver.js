import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Animated
} from 'react-native'
import StarRating from 'react-native-star-rating'
import { useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import AutoHeightImage from 'react-native-auto-height-image'
import moment from 'moment'
import 'moment/locale/ko'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modal'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import ImageView from 'react-native-image-viewing'

const { width, height } = Dimensions.get('window')

const Reviews = props => {
  const { navigation } = props
  const { allStore, selectedStore } = useSelector(state => state.store)
  const {
    mt_id: mtId,
    mt_jumju_code: mtJumjuCode,
    mt_name: mtName,
    mt_store: mtStore
  } = useSelector(state => state.login)
  const [selectReply, setSelectReply] = React.useState('') // 답변

  const [rate, setRate] = React.useState({})
  const [list, setList] = React.useState([])
  const [ItId, setItId] = React.useState('') // it_id
  const [WrId, setWrId] = React.useState('') // wr_id

  const param = {
    encodeJson: true,
    bo_table: 'review',
    item_count: 0,
    limit_count: 10,
    jumju_id: mtId,
    jumju_code: mtJumjuCode
  }

  const getReviewListHandler = () => {
    Api.send('store_review_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        setRate(arrItems.rate)
        setList(arrItems.review)
      } else {
        setRate(null)
        setList(null)
      }
    })
  }

  React.useEffect(() => {
    getReviewListHandler()
    return () => getReviewListHandler()
  }, [])

  const scrolling = React.useRef(new Animated.Value(0)).current

  const [aniHeight, setAniHeight] = React.useState(false)

  const translation = scrolling.interpolate({
    inputRange: [100, 700, 1000],
    outputRange: [-5, -5, 60],
    extrapolate: 'clamp'
  })

  const scale = scrolling.interpolate({
    inputRange: [100, 500, 800, 1100, 1300],
    outputRange: [1, 1, 1, 1.5, 1],
    extrapolate: 'clamp'
  })

  const opacity = scrolling.interpolate({
    inputRange: [100, 500, 600, 700],
    outputRange: [1, 0, 1, 1],
    extrapolate: 'clamp'
  })

  const zIndex = scrolling.interpolate({
    inputRange: [100, 500],
    outputRange: [-1, 10],
    extrapolate: 'clamp'
  })

  // 답글 모달 제어
  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false)
  const toggleCommentModal = () => {
    setCommentModalVisible(!isCommentModalVisible)
  }

  // 모달 제어
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  // 모달 insert 이미지
  const [selectImg, setSelectImg] = React.useState('')
  const selectModalImageHandler = async path => {
    try {
      await setSelectImg(path)
      await toggleModal()
    } catch (err) {
      Alert.alert('선택된 이미지가 없습니다.', '다시 확인해주세요.', [
        {
          text: '확인'
        }
      ])
    }
  }

  const onRefresh = () => {
    getReviewListHandler()
  }

  const setReply = () => {
    if (selectReply === null || selectReply === '') {
      Alert.alert('답변 내용을 입력해주세요.', '', [
        {
          text: '확인'
        }
      ])
    } else {
      const param = {
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        bo_table: 'review',
        it_id: ItId,
        wr_id: WrId,
        mode: 'comment',
        wr_content: selectReply,
        wr_name: mtName
      }

      Api.send('store_review_comment', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          toggleCommentModal()
          getReviewListHandler()
          setSelectReply('')
          Alert.alert('답변을 등록하였습니다.', '', [
            {
              text: '확인'
            }
          ])
        } else {
          getReviewListHandler()
          setSelectReply('')
          Alert.alert('답변을 등록하지 못하였습니다.', '답변을 등록하는데 문제가 있습니다.', [
            {
              text: '확인',
              onPress: () => toggleCommentModal()
            }
          ])
        }
      })
    }
  }

  const [visible, setIsVisible] = React.useState(false)
  const [modalImages, setModalImages] = React.useState([])

  const replyDelete = (it_id, wr_id) => {
    const param = {
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      bo_table: 'review',
      mode: 'comment_delete',
      it_id: it_id,
      wr_id: wr_id
    }

    Api.send('store_review_comment', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getReviewListHandler()
        Alert.alert('답변을 삭제하였습니다.', '', [
          {
            text: '확인'
          }
        ])
      } else {
        getReviewListHandler()
        Alert.alert('답변을 삭제하지 못하였습니다.', '답변을 삭제하는데 문제가 있습니다.', [
          {
            text: '확인'
          }
        ])
      }
    })
  }

  const replayDelteHandler = (payload01, payload02) => {
    Alert.alert('해당 답변을 정말 삭제하시겠습니까?', '', [
      {
        text: '삭제하기',
        onPress: () => replyDelete(payload01, payload02)
      },
      {
        text: '취소'
      }
    ])
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={index + item.wr_id}>
        <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />
        <View style={{ ...BaseStyle.mv20, ...BaseStyle.container, ...BaseStyle.ph20 }}>
          <View style={{ ...BaseStyle.mr10 }}>
            <Image
              source={{ uri: `${item.profile}` }}
              style={{ width: 55, height: 55, borderRadius: 55 }}
              resizeMode='cover'
            />
          </View>
          <View>
            <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.mb3 }}>
              {item.menu}
            </Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb3 }}>{item.wr_mb_id}</Text>
            <View style={{ ...BaseStyle.container }}>
              <StarRating
                disabled={false}
                emptyStar={require('../images/star_off.png')}
                fullStar={require('../images/star_on.png')}
                ratingColor='#3498db'
                ratingBackgroundColor='#c8c7c8'
                maxStars={5}
                rating={Math.round(item.rating)}
                starSize={12}
                containerStyle={{ width: 75, ...BaseStyle.mr10 }}
              />
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>
                {moment(item.datetime, 'YYYYMMDD').fromNow()}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {item.pic.length > 1 ? (
            <View style={{ width: Dimensions.get('window').width, ...BaseStyle.ph20 }}>
              <Swiper
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 250
                }}
                dotColor='#fff'
                dotStyle={{ width: 7, height: 7, borderRadius: 7 }}
                activeDotStyle={{ width: 7, height: 7, backgroundColor: Primary.PointColor01 }}
                showsPagination
                autoplay={false}
                loop={false}
              >
                {item.pic.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    onPress={() => {
                      setIsVisible(true)
                      const formatImg = item.pic.map(v => {
                        return { uri: v }
                      })
                      setModalImages(formatImg)
                    }}
                  >
                    <Image
                      source={{ uri: `${image}` }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      resizeMode='cover'
                    />
                  </TouchableOpacity>
                ))}
              </Swiper>
              <ImageView
                images={modalImages}
                imageIndex={0}
                visible={visible}
                // presentationStyle="overFullScreen"
                // animationType="fade"
                onRequestClose={() => setIsVisible(false)}
              />
            </View>
          ) : item.pic.length === 1 ? (
            <>
              <TouchableOpacity
                activeOpacity={1}
                // onPress={() => selectModalImageHandler(item.pic[0])}
                onPress={() => {
                  setIsVisible(true)
                  const formatImg = item.pic.map(v => {
                    return { uri: v }
                  })
                  setModalImages(formatImg)
                }}
              >
                <Image
                  source={{ uri: `${item.pic[0]}` }}
                  style={{
                    width: Dimensions.get('window').width - 40,
                    height: 250,
                    resizeMode: 'cover',
                    marginBottom: 5
                  }}
                />
                {/* <AutoHeightImage
                      source={{uri: `${item.pic[0]}`}}
                      width={Dimensions.get('window').width - 40}
                      style={{ marginBottom: 5 }}
                    /> */}
              </TouchableOpacity>
              <ImageView
                images={modalImages}
                imageIndex={0}
                visible={visible}
                // presentationStyle="overFullScreen"
                onRequestClose={() => setIsVisible(false)}
              />
            </>
          ) : null}
        </View>
        <View style={{ ...BaseStyle.ph20 }}>
          <Text
            style={{ ...BaseStyle.ko15, ...BaseStyle.lh23, ...BaseStyle.mt10, ...BaseStyle.mb10 }}
          >
            {item.content.replace('\n', '\n')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.mb30, ...BaseStyle.ph20 }}>
          {item.reply ? (
            <View
              style={{
                ...BaseStyle.ph20,
                ...BaseStyle.pv20,
                backgroundColor: Primary.PointColor02,
                borderRadius: 10,
                position: 'relative'
              }}
            >
              <View style={{ ...BaseStyle.container3 }}>
                {/* <View style={{...BaseStyle.mr10}}>
                  <Image source={require('../images/message_gray.png')} style={{width:23, height:23}} resizeMode="contain" />
                </View> */}
                <View>
                  <View
                    style={{ ...BaseStyle.container, ...BaseStyle.mb10, alignItems: 'baseline' }}
                  >
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.font_222,
                        ...BaseStyle.mr10
                      }}
                    >
                      {mtStore}
                    </Text>
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_666 }}>
                      {moment(item.replayDate).format('YYYY.MM.DD  a h:mm ')}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...BaseStyle.ko15,
                      ...BaseStyle.lh22,
                      ...BaseStyle.font_white,
                      width: '100%',
                      flexWrap: 'wrap'
                    }}
                  >
                    {item.replyComment}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => replayDelteHandler(item.it_id, item.wr_id)}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <Image
                  source={require('../images/popup_close.png')}
                  style={{ width: 22, height: 22, opacity: 0.5 }}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ ...BaseStyle.container }}>
              {/* <TextInput
                value={selectReply}
                placeholder="답변달기"
                style={{
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.border,
                  flex:1,
                  ...BaseStyle.mr5,
                  ...BaseStyle.lh22
                }}
                onChangeText={text => setSelectReply(text)}
                autoCapitalize="none"
                multiline
              /> */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setItId(item.it_id)
                  setWrId(item.wr_id)
                  toggleCommentModal()
                  // setReply(item.it_id, item.wr_id)
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#20ABC8',
                  height: 50,
                  width: '50%',
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5
                }}
              >
                <Image
                  source={require('../images/reply_wh.png')}
                  style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                  resizeMode='contain'
                />
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222 }}>
                  답변 달기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                // onPress={() => {
                //   setItId(item.it_id);
                //   setWrId(item.wr_id);
                //   toggleCommentModal();
                //   // setReply(item.it_id, item.wr_id)
                // }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e5e5e5',
                  height: 50,
                  width: '50%',
                  borderRadius: 0,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                <Image
                  source={require('../images/bell.png')}
                  style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                  resizeMode='contain'
                />
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222 }}>
                  악성 리뷰 신고
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ zIndex: 99999, backgroundColor: '#fff' }}>
        <Header navigation={navigation} title='리뷰관리' />
      </View>
      {/* 이미지 모달 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={1}
        transparent
        statusBarTranslucent
        style={{ flex: 1, padding: 0, margin: 0 }}
      >
        <AutoHeightImage source={{ uri: `${selectImg}` }} width={Dimensions.get('window').width} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleModal}
          style={{
            position: 'absolute',
            top: 70,
            right: 10
          }}
        >
          <Image
            source={require('../images/ic_del.png')}
            style={{ width: 30, height: 30, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </Modal>
      {/* //이미지 모달 */}

      {/* 답변 모달 */}
      <Modal
        isVisible={isCommentModalVisible}
        // onBackdropPress={toggleCommentModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='bounceInUp'
        animationInTiming={300}
      >
        <KeyboardAvoidingView
          behavior='position'
          style={{ backgroundColor: '#fff', borderRadius: 15 }}
          enabled
        >
          <View
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              ...BaseStyle.pv30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15
            }}
          >
            {/* <TouchableOpacity
              activeOpacity={1}
              onPress={toggleCommentModal}
              hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                backgroundColor: Primary.PointColor02,
                borderRadius: 50,
                padding: 10,
              }}>
              <Image
                source={require('../images/close_wh.png')}
                style={{width: 10, height: 10}}
                resizeMode="center"
              />
            </TouchableOpacity> */}
            <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb15, ...BaseStyle.font_bold }}>
              리뷰에 대한 답변을 입력해주세요.
            </Text>
            <View style={{ width: '100%', ...BaseStyle.ph30 }}>
              <View style={{ ...BaseStyle.ph10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
                <TextInput
                  value={selectReply}
                  style={{
                    width: '100%',
                    ...BaseStyle.ko15,
                    ...BaseStyle.lh24,
                    ...BaseStyle.mv15
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical='top'
                  placeholder='답변을 입력해주세요.'
                  underlineColorAndroid='transparent'
                  onChangeText={text => setSelectReply(text)}
                  autoCapitalize='none'
                />
              </View>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph30 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (selectReply !== null && selectReply !== '') {
                    setReply()
                  }
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: selectReply !== null && selectReply !== '' ? '#20ABC8' : '#e5e5e5',
                  backgroundColor: selectReply !== null && selectReply !== '' ? '#20ABC8' : '#fff',
                  paddingVertical: 15,
                  flex: 1,
                  ...BaseStyle.pv15,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_bold,
                    color: selectReply !== null && selectReply !== '' ? '#222' : '#e5e5e5'
                  }}
                >
                  답변 전송
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={toggleCommentModal}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#e5e5e5',
                  backgroundColor: '#e5e5e5',
                  paddingVertical: 15,
                  flex: 1,
                  ...BaseStyle.pv15,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    color: '#666'
                  }}
                >
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* // 답변 모달 */}

      {/* 커스텀 총 평점 */}
      {rate !== null ? (
        <Animated.View
          style={{
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: '#fff',
            // opacity: opacity,
            transform: [
              {
                translateY: translation
              }
            ]
          }}
        >
          <View style={{ ...BaseStyle.container5, ...BaseStyle.pv15, ...BaseStyle.ph20 }}>
            <View style={{ ...BaseStyle.container }}>
              <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                총 평점 :{' '}
              </Text>
              <Animated.Text
                style={{
                  ...BaseStyle.ko20,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.mr5,
                  transform: [
                    {
                      scale: scale
                    }
                  ]
                }}
              >
                {rate.avg}
              </Animated.Text>
              <StarRating
                disabled={false}
                emptyStar={require('../images/star_off.png')}
                fullStar={require('../images/star_on.png')}
                ratingColor='#3498db'
                ratingBackgroundColor='#c8c7c8'
                maxStars={5}
                rating={Math.round(rate.avg)}
                starSize={10}
                containerStyle={{ width: 50 }}
                onSwi
              />
            </View>
            <View style={{ ...BaseStyle.container5, alignSelf: 'flex-end' }}>
              <View style={{ ...BaseStyle.container2, ...BaseStyle.mh05 }}>
                <Text style={{ ...BaseStyle.ko14 }}>5점</Text>
                <Text style={{ ...BaseStyle.ko10 }}>{rate.rating_cnt5}</Text>
              </View>
              <View style={{ ...BaseStyle.container2, ...BaseStyle.mh05 }}>
                <Text style={{ ...BaseStyle.ko14 }}>4점</Text>
                <Text style={{ ...BaseStyle.ko10 }}>{rate.rating_cnt4}</Text>
              </View>
              <View style={{ ...BaseStyle.container2, ...BaseStyle.mh05 }}>
                <Text style={{ ...BaseStyle.ko14 }}>3점</Text>
                <Text style={{ ...BaseStyle.ko10 }}>{rate.rating_cnt3}</Text>
              </View>
              <View style={{ ...BaseStyle.container2, ...BaseStyle.mh05 }}>
                <Text style={{ ...BaseStyle.ko14 }}>2점</Text>
                <Text style={{ ...BaseStyle.ko10 }}>{rate.rating_cnt2}</Text>
              </View>
              <View style={{ ...BaseStyle.container2, ...BaseStyle.mh05 }}>
                <Text style={{ ...BaseStyle.ko14 }}>1점</Text>
                <Text style={{ ...BaseStyle.ko10 }}>{rate.rating_cnt1}</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#e5e5e5' }} />
        </Animated.View>
      ) : null}
      {/* //커스텀 총 평점 */}

      {/* 리뷰 리스트 */}
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          data={list}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrolling
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing
          // onRefresh={() => onRefresh()}
          style={{ backgroundColor: '#fff', width: '100%' }}
          ListHeaderComponent={
            <View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  ...BaseStyle.ph20,
                  ...BaseStyle.mt20
                }}
              >
                <Text style={{ ...BaseStyle.ko15 }}>
                  <Text style={{ ...BaseStyle.font_bold }}>{mtStore}</Text> 의 총 리뷰 & 평점
                </Text>
              </View>
              {rate !== null ? (
                <View style={{ ...BaseStyle.container, ...BaseStyle.ph40, ...BaseStyle.pv20 }}>
                  <View
                    style={{ justifyContent: 'center', alignItems: 'center', ...BaseStyle.mr40 }}
                  >
                    <Text style={{ ...BaseStyle.ko18, fontSize: 55 }}>{rate.avg}</Text>
                    <StarRating
                      disabled={false}
                      emptyStar={require('../images/star_off.png')}
                      fullStar={require('../images/star_on.png')}
                      ratingColor='#3498db'
                      ratingBackgroundColor='#c8c7c8'
                      maxStars={5}
                      rating={Math.round(rate.avg)}
                      starSize={12}
                      containerStyle={{ width: 75 }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Text style={{ ...BaseStyle.ko13, ...BaseStyle.mr10 }}>5점</Text>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per5}
                        width={180}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        style={{ backgroundColor: '#E3E3E3' }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        {rate.rating_cnt5}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Text style={{ ...BaseStyle.ko13, ...BaseStyle.mr10 }}>4점</Text>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per4}
                        width={180}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        style={{ backgroundColor: '#E3E3E3' }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        {rate.rating_cnt4}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Text style={{ ...BaseStyle.ko13, ...BaseStyle.mr10 }}>3점</Text>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per3}
                        width={180}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        style={{ backgroundColor: '#E3E3E3' }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        {rate.rating_cnt3}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Text style={{ ...BaseStyle.ko13, ...BaseStyle.mr10 }}>2점</Text>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per2}
                        width={180}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        style={{ backgroundColor: '#E3E3E3' }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        {rate.rating_cnt2}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container }}>
                      <Text style={{ ...BaseStyle.ko13, ...BaseStyle.mr10 }}>1점</Text>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per1}
                        width={180}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        style={{ backgroundColor: '#E3E3E3' }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        {rate.rating_cnt1}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: Dimensions.get('window').height - 300
              }}
            >
              <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
                아직 등록된 리뷰 및 평점이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      {/* //리뷰 리스트 */}
    </View>
  )
}

export default Reviews
