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
  Animated,
  StyleSheet,
  BackHandler,
  ActivityIndicator
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import StarRating from 'react-native-star-rating'
import { useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import AutoHeightImage from 'react-native-auto-height-image'
import moment from 'moment'
import 'moment/locale/ko'
import Swiper from 'react-native-swiper'
// import Swipeout from 'react-native-swipeout-mod' // 스와이프 기능(수정, 삭제)
import Modal from 'react-native-modal'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import ImageView from 'react-native-image-viewing'
import cusToast from '../components/CusToast'
// import AnimateLoading from '../components/AnimateLoading'

// const { width, height } = Dimensions.get('window')

const Reviews = props => {
  const { navigation } = props
  // const { allStore, selectedStore } = useSelector(state => state.store)
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
  const [wrId, setWrId] = React.useState('') // wr_id
  const [notice, setNotice] = React.useState({}) // Notice

  const [imageLoad, setImageLoad] = React.useState(false)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const param = {
    encodeJson: true,
    bo_table: 'review',
    item_count: 0,
    limit_count: 10,
    jumju_id: mtId,
    jumju_code: mtJumjuCode
  }

  const getReviewList02Handler = () => {
    Api.send('store_review_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        if (arrItems.rate) {
          setRate(arrItems.rate)
        }
        if (arrItems.review) {
          setList(arrItems.review)
        }
        if (arrItems.notice !== null && arrItems.notice !== '') {
          setNotice(arrItems.notice)
        } else {
          setNotice(null)
        }
        if (arrItems === null) {
          setRate(null)
          setList(null)
          setNotice(null)
        }
      } else {
        setRate(null)
        setList(null)
        setNotice(null)
      }
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getReviewList02Handler()
    })
    return unsubscribe
  }, [navigation])

  const scrolling = React.useRef(new Animated.Value(0)).current

  const translation = scrolling.interpolate({
    inputRange: [100, 700, 1000],
    outputRange: [-5, -5, 60],
    extrapolate: 'clamp'
  })

  // const scale = scrolling.interpolate({
  //   inputRange: [100, 500, 800, 1100, 1300],
  //   outputRange: [1, 1, 1, 1.5, 1],
  //   extrapolate: 'clamp'
  // })

  // const opacity = scrolling.interpolate({
  //   inputRange: [100, 500, 600, 700],
  //   outputRange: [1, 0, 1, 1],
  //   extrapolate: 'clamp'
  // })

  // const zIndex = scrolling.interpolate({
  //   inputRange: [100, 500],
  //   outputRange: [-1, 10],
  //   extrapolate: 'clamp'
  // })

  // 답글 모달 제어
  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false)
  const toggleCommentModal = () => {
    setCommentModalVisible(!isCommentModalVisible)
  }

  // 악성 리뷰 신고 모달
  const [isSpamReviewModalVisible, setSpamReviewModalVisible] = React.useState(false)
  const toggleSpamModal = () => {
    setSpamReviewModalVisible(!isSpamReviewModalVisible)
  }

  // 모달 제어
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  // 모달 insert 이미지
  const [selectImg, setSelectImg] = React.useState('')
  async function selectModalImageHandler (path) {
    try {
      setSelectImg(path)
      toggleModal()
    } catch (err) {
      Alert.alert('선택된 이미지가 없습니다.', '다시 확인해주세요.', [
        {
          text: '확인'
        }
      ])
    }
  }

  // const onRefresh = () => getReviewListHandler()

  function setReply () {
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
        wr_id: wrId,
        mode: 'comment',
        wr_content: selectReply,
        wr_name: mtName
      }

      Api.send('store_review_comment', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          toggleCommentModal()
          getReviewList02Handler()
          setSelectReply('')
          Alert.alert('답변을 등록하였습니다.', '', [
            {
              text: '확인'
            }
          ])
        } else {
          getReviewList02Handler()
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

  // 답변 삭제 api 호출
  function replyDelete (itId, wrId) {
    const param = {
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      bo_table: 'review',
      mode: 'comment_delete',
      it_id: itId,
      wr_id: wrId
    }

    Api.send('store_review_comment', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      getReviewList02Handler()
      if (resultItem.result === 'Y') {
        Alert.alert('답변을 삭제하였습니다.', '', [
          {
            text: '확인'
          }
        ])
      } else {
        Alert.alert('답변을 삭제하지 못하였습니다.', '답변을 삭제하는데 문제가 있습니다.', [
          {
            text: '확인'
          }
        ])
      }
    })
  }

  // 답변 삭제
  function replayDelteHandler (payload01, payload02) {
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

  // 오른쪽에서 왼쪽으로 스와이프(swipe)시 액션
  function renderRightActions (progress, dragX) {
    const trans = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0]
      // inputRange: [0, 50, 100, 101],
      // outputRange: [-20, 0, 0, 0],
    })
    return (
      <RectButton style={styles.leftAction}>
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              ...BaseStyle.container5,
              ...BaseStyle.ph20,
              backgroundColor: '#fff',
              transform: [{ translateX: trans }]
            }
          ]}
        >
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: 'center' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>5점</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
              {rate.rating_cnt5 > 99 ? '99+' : rate.rating_cnt5}
            </Text>
          </View>
          <View style={{ width: 1, height: '50%', backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: 'center' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>4점</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
              {rate.rating_cnt4 > 99 ? '99+' : rate.rating_cnt4}
            </Text>
          </View>
          <View style={{ width: 1, height: '50%', backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: 'center' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>3점</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
              {rate.rating_cnt3 > 99 ? '99+' : rate.rating_cnt3}
            </Text>
          </View>
          <View style={{ width: 1, height: '50%', backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: 'center' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>2점</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
              {rate.rating_cnt2 > 99 ? '99+' : rate.rating_cnt2}
            </Text>
          </View>
          <View style={{ width: 1, height: '50%', backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: 'center' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>1점</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
              {rate.rating_cnt1 > 99 ? '99+' : rate.rating_cnt1}
            </Text>
          </View>
        </Animated.View>
      </RectButton>
    )
  }

  // 리뷰 렌더러(내용물)
  const renderRow = ({ item, index }) => {
    return (
      <View key={index + item.wr_id}>
        <View style={{ height: 10, width: '100%', backgroundColor: '#F2F2F2' }} />
        <View style={{ ...BaseStyle.mv20, ...BaseStyle.container, ...BaseStyle.ph20 }}>
          <View style={{ ...BaseStyle.mr10 }}>
            <Image
              source={{ uri: `${item.profile}` }}
              style={{ width: 55, height: 55, borderRadius: 55 }}
              resizeMode='cover'
            />
          </View>

          <View>
            {/* <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.mb3 }}>
              {item.menu}
            </Text> */}
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb3 }}>{item.wr_mb_id}</Text>
            <View style={{ ...BaseStyle.container }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.mr15 }}>
                {moment(item.datetime, 'YYYYMMDD').fromNow()}
              </Text>
              <StarRating
                activeOpacity={1}
                disabled={false}
                emptyStar={require('../images/ico_star_off.png')}
                fullStar={require('../images/ico_star_on.png')}
                ratingColor='#3498db'
                ratingBackgroundColor='#c8c7c8'
                maxStars={5}
                // rating={Math.round(rate.avg)}
                rating={item.rating}
                starSize={15}
              />
            </View>
          </View>
        </View>
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.mb10 }}>
          <Text>{item.content}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', ...BaseStyle.mb10 }}>
          {item.pic.length > 1 && (
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
                // loadMinimal
                // loadMinimalLoader={<ActivityIndicator color='#000' size='small' />}
                // automaticallyAdjustContentInsets
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
                    {imageLoad && (
                      <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 0 }}>
                        <ActivityIndicator color={Primary.PointColor01} />
                      </View>
                    )}

                    <Image
                      source={{ uri: `${image}` }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      resizeMode='cover'
                      onLoadStart={() => setImageLoad(true)}
                      onLoadEnd={() => setImageLoad(false)}
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
          )}
          {item.pic.length === 1 && (
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
                {imageLoad && (
                  <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 0 }}>
                    <ActivityIndicator color={Primary.PointColor01} />
                  </View>
                )}
                <Image
                  source={{ uri: `${item.pic[0]}` }}
                  style={{
                    width: Dimensions.get('window').width - 40,
                    height: 250,
                    resizeMode: 'cover',
                    marginBottom: 5
                  }}
                  onLoadStart={() => setImageLoad(true)}
                  onLoadEnd={() => setImageLoad(false)}
                />
              </TouchableOpacity>
              <ImageView
                images={modalImages}
                imageIndex={0}
                visible={visible}
                // presentationStyle="overFullScreen"
                onRequestClose={() => setIsVisible(false)}
              />
            </>
          )}
        </View>

        <View style={{ ...BaseStyle.mb30, ...BaseStyle.ph20 }}>
          {item.reply && (
            <View
              style={{
                ...BaseStyle.ph20,
                ...BaseStyle.pv20,
                backgroundColor: Primary.PointColor03,
                borderRadius: 5,
                position: 'relative'
              }}
            >
              <View style={{ ...BaseStyle.container3 }}>
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
          )}

          {!item.reply && (
            <View style={{ ...BaseStyle.container }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setItId(item.it_id)
                  setWrId(item.wr_id)
                  toggleCommentModal()
                  // setReply(item.it_id, item.wr_id)
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#20ABC8',
                  height: 45,
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5
                }}
              >
                <Image
                  source={require('../images/reply_wh.png')}
                  style={{ width: 18, height: 18, ...BaseStyle.mr10, marginTop: -2 }}
                  resizeMode='contain'
                />
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>답변 달기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (item.wr_singo === 'N') {
                    setItId(item.it_id)
                    setWrId(item.wr_id)
                    toggleSpamModal()

                    // setReply(item.it_id, item.wr_id)
                  }
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.wr_singo === 'N' ? '#e5e5e5' : '#FCA000',
                  height: 45,
                  borderRadius: 0,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                {item.wr_singo === 'N' && (
                  <Image
                    source={require('../images/bell.png')}
                    style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                    resizeMode='contain'
                  />
                )}
                {item.wr_singo === 'Y' && (
                  <Image
                    source={require('../images/bell_wh.png')}
                    style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                    resizeMode='contain'
                  />
                )}
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.font_222,
                    color: item.wr_singo === 'N' ? '#222' : '#fff'
                  }}
                >
                  {item.wr_singo === 'N' ? '악성 리뷰 신고' : '신고된 리뷰'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  const swipeBtns = [
    {
      text: '자세히',
      component: (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 2,
            paddingHorizontal: 5,
            backgroundColor: '#ececec',
            borderRadius: 5
          }}
        >
          <Text style={{ ...BaseStyle.ko10 }}>자세히보기</Text>
        </TouchableOpacity>
      ),
      color: '#222',
      backgroundColor: 'transparent',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)'
    }
  ]

  // 악성 리뷰 신고하기
  const sendSpamReviewHandler = () => {
    //     secretKey:1111882EAD94E9C493CEF089E1B023A2122BA778
    // encodeJson:true
    // jumju_id:dnb_0001
    // jumju_code:P20220600001
    // bo_table:review
    // wr_id:10
    // wr_singo:Y

    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      bo_table: 'review',
      wr_id: wrId,
      wr_singo: 'Y'
    }

    Api.send('store_review_singo', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        cusToast('악성 리뷰로 신고하였습니다.', 1500)
      } else {
        cusToast('악성 리뷰로 신고 중 문제가 발생하였습니다.', 1500)
      }

      toggleSpamModal()
      getReviewList02Handler()
    })
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

      {/* 악성 리뷰 신고 모달 */}
      <Modal
        isVisible={isSpamReviewModalVisible}
        onBackdropPress={toggleSpamModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='slideInUp'
        animationInTiming={100}
      >
        <View
          style={{
            backgroundColor: '#fff',
            ...BaseStyle.pv30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleSpamModal}
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: Primary.PointColor01,
              borderRadius: 30,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../images/close.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'center'
              }}
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko14 }}>악성 리뷰로 신고하시겠습니까?</Text>
          <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={sendSpamReviewHandler}
              style={{
                ...BaseStyle.container1,
                height: 45,
                backgroundColor: Primary.PointColor01,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5
              }}
            >
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>신고하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleSpamModal}
              style={{
                ...BaseStyle.container1,
                height: 45,
                backgroundColor: Primary.PointColor03,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5
              }}
            >
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* // 악성 리뷰 신고 모달 */}

      {/* 답변 모달 */}
      <Modal
        isVisible={isCommentModalVisible}
        // onBackdropPress={toggleCommentModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='slideInUp'
        animationInTiming={100}
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
              borderRadius: 5
            }}
          >
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
                    ...BaseStyle.ko14,
                    color: selectReply !== null && selectReply !== '' ? '#fff' : '#e5e5e5'
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
                    ...BaseStyle.ko14,
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
      {JSON.stringify(rate) !== '{}' && (
        <Animated.View
          style={{
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            ...BaseStyle.ph10,
            backgroundColor: '#fff',
            // opacity: opacity,
            transform: [
              {
                translateY: translation
              }
            ]
          }}
        >
          {/* <Swipeout right={swipeBtns} autoClose="true" backgroundColor="transparent"> */}
          <Swipeable renderRightActions={renderRightActions}>
            <View
              style={{
                ...styles.rectButton,
                width: '100%',
                ...BaseStyle.container5,
                ...BaseStyle.pv15,
                ...BaseStyle.ph10
              }}
            >
              <View style={{ ...BaseStyle.container }}>
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_bold,
                    ...BaseStyle.mr20,
                    maxWidth: Dimensions.get('window').width / 2
                  }}
                  numberOfLines={1}
                  lineBreakMode='tail'
                >
                  {mtStore}
                </Text>
              </View>
              <View style={{ ...BaseStyle.container0 }}>
                <Text style={{ ...BaseStyle.mr5 }}>
                  평점 :{' '}
                  <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>{rate.avg}</Text>
                </Text>
                <StarRating
                  activeOpacity={1}
                  disabled={false}
                  emptyStar={require('../images/ico_star_off.png')}
                  fullStar={require('../images/ico_star_on.png')}
                  ratingColor='#3498db'
                  ratingBackgroundColor='#c8c7c8'
                  maxStars={5}
                  rating={Math.round(rate.avg)}
                  starSize={17}
                />
              </View>
              {/* <View style={{...BaseStyle.container5, alignSelf: "flex-end"}}>
                <Image
                  source={require("../images/swipe_m.png")}
                  style={{width: 50, height: 25, marginLeft: 10}}
                  resizeMode="contain"
                />
              </View> */}
            </View>
          </Swipeable>
          {/* </Swipeout> */}
          <View style={{ height: 1, backgroundColor: '#e5e5e5' }} />
        </Animated.View>
      )}
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
                  ...BaseStyle.mt20,
                  ...BaseStyle.mb20
                }}
              >
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_666, ...BaseStyle.mb10 }}>
                  총 리뷰 & 평점
                </Text>
                <Text style={{ ...BaseStyle.ko20, ...BaseStyle.font_bold }}>{mtStore}</Text>
              </View>

              <View
                style={{
                  ...BaseStyle.container,
                  ...BaseStyle.ph20,
                  ...BaseStyle.pb20
                }}
              >
                {/* 평점 별표(큰 부분) */}
                {rate && (
                  <View
                    style={{
                      flex: 1.5,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      height: '100%',
                      ...BaseStyle.pt10
                    }}
                  >
                    <Text
                      style={{
                        ...BaseStyle.font_main,
                        fontWeight: 'bold',
                        fontSize: 45,
                        marginTop: -20
                      }}
                    >
                      {rate.avg}
                    </Text>
                    <StarRating
                      activeOpacity={1}
                      disabled={false}
                      emptyStar={require('../images/ico_star_off.png')}
                      fullStar={require('../images/ico_star_on.png')}
                      ratingColor='#3498db'
                      ratingBackgroundColor='#c8c7c8'
                      maxStars={5}
                      // rating={Math.round(rate.avg)}
                      rating={Math.round(rate.avg)}
                      starSize={17}
                    />
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mt10 }}>
                      <Text style={{ ...BaseStyle.ko16, marginTop: 5, ...BaseStyle.mr5 }}>총</Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          ...BaseStyle.ko20,
                          ...BaseStyle.font_main
                        }}
                      >
                        {rate.total_cnt > 99 ? '99+' : rate.total_cnt}
                      </Text>
                      <Text style={{ ...BaseStyle.ko16, marginTop: 5 }}>건</Text>
                    </View>
                  </View>
                )}
                {/* //평점 별표(큰 부분)   */}

                {/* 중간 선 */}
                <View
                  style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: '#ececec',
                    ...BaseStyle.pv20,
                    ...BaseStyle.mh30,
                    ...BaseStyle.mr10
                  }}
                />
                {/* // 중간 선 */}
                {rate && (
                  <View style={{ flex: 2 }}>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per5}
                        width={100}
                        height={6}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        borderRadius={10}
                        style={{ backgroundColor: '#F2F2F2', ...BaseStyle.mr5 }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_black, ...BaseStyle.ml10 }}
                      >
                        5점 ({rate.rating_cnt5 > 99 ? '99+' : rate.rating_cnt5})
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per4}
                        width={100}
                        height={6}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        borderRadius={10}
                        style={{ backgroundColor: '#F2F2F2', ...BaseStyle.mr5 }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_black, ...BaseStyle.ml10 }}
                      >
                        4점 ({rate.rating_cnt4 > 99 ? '99+' : rate.rating_cnt4})
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per3}
                        width={100}
                        height={6}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        borderRadius={10}
                        style={{ backgroundColor: '#F2F2F2', ...BaseStyle.mr5 }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_black, ...BaseStyle.ml10 }}
                      >
                        3점 ({rate.rating_cnt3 > 99 ? '99+' : rate.rating_cnt3})
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per2}
                        width={100}
                        height={6}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        borderRadius={10}
                        style={{ backgroundColor: '#F2F2F2', ...BaseStyle.mr5 }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_black, ...BaseStyle.ml10 }}
                      >
                        2점 ({rate.rating_cnt2 > 99 ? '99+' : rate.rating_cnt2})
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per1}
                        width={100}
                        height={6}
                        color={Primary.PointColor01}
                        borderColor='#fff'
                        borderRadius={10}
                        style={{ backgroundColor: '#F2F2F2', ...BaseStyle.mr5 }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_black, ...BaseStyle.ml10 }}
                      >
                        1점 ({rate.rating_cnt1 > 99 ? '99+' : rate.rating_cnt1})
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* 공지글 작성 */}
              {notice && (
                <>
                  <View
                    style={{
                      ...BaseStyle.mh20,
                      ...BaseStyle.mb10,
                      ...BaseStyle.pb10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#ececec',
                      borderRadius: 5
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#ececec',
                        width: '100%',
                        ...BaseStyle.pv10
                      }}
                    >
                      <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>
                        리뷰 공지사항
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
                      <Text style={{ ...BaseStyle.ko14 }}>{notice.noticeContent}</Text>
                    </View>
                    {notice.noticePic?.map((pic, index) => (
                      <AutoHeightImage
                        key={`${pic}-${index}`}
                        source={{ uri: `${pic}` }}
                        width={Dimensions.get('window').width - 60}
                      />
                    ))}
                  </View>
                  <View style={{ ...BaseStyle.ph20, ...BaseStyle.pb20 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('ReviewNotice', { type: 'edit', item: notice })}
                      style={{
                        ...BaseStyle.mainBtn
                      }}
                    >
                      <Text
                        style={{
                          ...BaseStyle.ko14,
                          ...BaseStyle.font_bold,
                          ...BaseStyle.font_white
                        }}
                      >
                        리뷰 공지 수정
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {!notice && (
                <View style={{ ...BaseStyle.ph20, ...BaseStyle.pb20 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('ReviewNotice', { type: 'write' })}
                    style={{
                      ...BaseStyle.mainBtn
                    }}
                  >
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.font_white
                      }}
                    >
                      리뷰 공지 작성
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* // 공지글 작성 */}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyView}>
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

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  actionText: {
    color: 'black',
    fontSize: 16
  },
  rectButton: {
    width: '100%',
    backgroundColor: 'white'
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 100
  }
})

export default Reviews
