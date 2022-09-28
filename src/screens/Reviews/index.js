import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  StyleSheet,
  BackHandler,
  Platform
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import StarRating from 'react-native-star-rating'
import { useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import AutoHeightImage from 'react-native-auto-height-image'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../../components/CusToast'
import AnimateLoading from '../../components/Loading/AnimateLoading'
import Divider from '../../components/Divider'
import ReviewRender from '../../components/Review/ReviewRender'
import SendSpamModal from '../../components/Review/SendSpamModal'
import ImageModal from '../../components/Review/ImageModal'
import ReplyModal from '../../components/Review/ReplyModal'

const Reviews = props => {
  const { navigation } = props

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
  const [isLoading, setLoading] = React.useState(true)

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
        setRate(arrItems.rate ? arrItems.rate : null)
        setList(arrItems.review ? arrItems.review : null)
        setNotice(arrItems.notice ? arrItems.notice : null)
      }

      setLoading(false)
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
    outputRange: Platform.OS === 'ios' ? [-5, -5, 98] : [-5, -5, 60],
    extrapolate: 'clamp'
  })

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
  const selectModalImageHandler =  async (path) => {
    try {
      setSelectImg(path)
      toggleModal()
    } catch (err) {
      cusToast('선택된 이미지가 없습니다.\n다시 확인해주세요.', 2500)
    }
  }

  const setReply = () => {
    if (selectReply === null || selectReply === '') {
      cusToast('답변 내용을 입력해주세요.')
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

        if (resultItem.result === 'Y') {
          toggleCommentModal()
          cusToast('답변을 등록하였습니다.')
        } else {
          cusToast('답변을 등록하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 2500)
          setTimeout(() => {
            toggleCommentModal()
          }, 1000)
        }
        getReviewList02Handler()
        setSelectReply('')
      })
    }
  }

  const [visible, setIsVisible] = React.useState(false)
  const [modalImages, setModalImages] = React.useState([])

  /**
   * 답변 삭제 api 호출
   * @param {number} itId 리뷰 아이디(id)
   * @param {number} wrId 답변 아이디(id)
   */
  const replyDelete = (itId, wrId) => {
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

      getReviewList02Handler()
      if (resultItem.result === 'Y') {
        cusToast('답변을 삭제하였습니다.')
      } else {
        cusToast('답변을 삭제하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 2500)
      }
    })
  }

  /**
   * 답변 삭제 컨펌 
   * @param {number} payload01 리뷰 아이디(id)
   * @param {number} payload02 답변 아이디(id)
   */
  const replyDeleteHandler = (payload01, payload02) => {
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

  // 스크롤 이벤트 평점 영역 오른쪽에서 왼쪽으로 스와이프(swipe)시 액션
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0]
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
      <ReviewRender 
        key={index + item.wr_id} 
        item={item} 
        imageLoad={imageLoad} 
        setImageLoad={setImageLoad} 
        modalImages={modalImages}
        setModalImages={setModalImages}
        visible={visible}
        setIsVisible={setIsVisible}
        mtStore={mtStore}
        setItId={setItId}
        setWrId={setWrId}
        toggleCommentModal={toggleCommentModal}
        replyDeleteHandler={replyDeleteHandler}
        toggleSpamModal={toggleSpamModal}
      />
    )
  }

  // 악성 리뷰 신고하기
  const sendSpamReviewHandler = () => {
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
    <>

      {/* 이미지 모달 */}
      <ImageModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        selectImg={selectImg}
      />
      {/* //이미지 모달 */}

      {/* 악성 리뷰 신고 모달 */}
      <SendSpamModal 
        isSpamReviewModalVisible={isSpamReviewModalVisible} 
        toggleSpamModal={toggleSpamModal} 
        sendSpamReviewHandler={sendSpamReviewHandler} 
      />
      {/* // 악성 리뷰 신고 모달 */}

      {/* 답변 모달 */}
      <ReplyModal
        isCommentModalVisible={isCommentModalVisible}
        selectReply={selectReply}
        setSelectReply={setSelectReply}
        toggleCommentModal={toggleCommentModal}
        setReply={setReply}
      />
      {/* // 답변 모달 */}


      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
      (<View style={{ flex: 1, backgroundColor: '#fff' }} testID='reviewScreen'>
        <View style={{ zIndex: 99999, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='리뷰관리' />
        </View>

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
              transform: [
                {
                  translateY: translation
                }
              ]
            }}
          >
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
                    emptyStar={require('../../images/ico_star_off.png')}
                    fullStar={require('../../images/ico_star_on.png')}
                    ratingColor='#3498db'
                    ratingBackgroundColor='#c8c7c8'
                    maxStars={5}
                    rating={Math.round(rate.avg)}
                    starSize={17}
                  />
                </View>
              </View>
            </Swipeable>
            {/* </Swipeout> */}

            <Divider />

          </Animated.View>
        )}
        {/* //커스텀 총 평점 */}

        {/* 리뷰 리스트 */}
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            testID='reviewFlatList'
            bounces={false}
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
            persistentScrollbar
            showsVerticalScrollIndicator={false}
            refreshing
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
                        emptyStar={require('../../images/ico_star_off.png')}
                        fullStar={require('../../images/ico_star_on.png')}
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
      )}
    </>
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
    marginVertical: 100
  }
})

export default Reviews
