import * as React from "react"
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
} from "react-native"
import { RectButton } from "react-native-gesture-handler"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { useSelector } from "react-redux"
import * as Progress from "react-native-progress"
import AutoHeightImage from "react-native-auto-height-image"
import moment from "moment"
import "moment/locale/ko"
import Swiper from "react-native-swiper"
import Swipeout from "react-native-swipeout-mod" // 스와이프 기능(수정, 삭제)
import Modal from "react-native-modal"
import Header from "../components/SubHeader"
import BaseStyle, { Primary } from "../styles/Base"
import Api from "../Api"
import ImageView from "react-native-image-viewing"

const { width, height } = Dimensions.get("window")

const Reviews = props => {
  const { navigation } = props
  const { allStore, selectedStore } = useSelector(state => state.store)
  const { mt_id, mt_jumju_code, mt_name, mt_store } = useSelector(state => state.login)
  const [selectReply, setSelectReply] = React.useState("") // 답변

  const [rate, setRate] = React.useState({})
  const [list, setList] = React.useState([])
  const [ItId, setItId] = React.useState("") // it_id
  const [WrId, setWrId] = React.useState("") // wr_id
  const [notice, setNotice] = React.useState({}) // Notice

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction)
  }, [])

  const param = {
    encodeJson: true,
    bo_table: "review",
    item_count: 0,
    limit_count: 10,
    jumju_id: mt_id,
    jumju_code: mt_jumju_code,
  }

  const getReviewList02Handler = () => {
    Api.send("store_review_list2", param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === "Y") {
        console.log("review02 arrItems", arrItems)

        if (arrItems.rate) {
          setRate(arrItems.rate)
        }
        if (arrItems.review) {
          setList(arrItems.review)
        }
        if (arrItems.notice !== null && arrItems.notice !== "") {
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
    const unsubscribe = navigation.addListener("focus", () => {
      getReviewList02Handler()
    })
    return unsubscribe
  }, [navigation])

  console.log("rate", rate)

  const scrolling = React.useRef(new Animated.Value(0)).current

  const [aniHeight, setAniHeight] = React.useState(false)

  const translation = scrolling.interpolate({
    inputRange: [100, 700, 1000],
    outputRange: [-5, -5, 60],
    extrapolate: "clamp",
  })

  const scale = scrolling.interpolate({
    inputRange: [100, 500, 800, 1100, 1300],
    outputRange: [1, 1, 1, 1.5, 1],
    extrapolate: "clamp",
  })

  const opacity = scrolling.interpolate({
    inputRange: [100, 500, 600, 700],
    outputRange: [1, 0, 1, 1],
    extrapolate: "clamp",
  })

  const zIndex = scrolling.interpolate({
    inputRange: [100, 500],
    outputRange: [-1, 10],
    extrapolate: "clamp",
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
  const [selectImg, setSelectImg] = React.useState("")
  const selectModalImageHandler = async path => {
    try {
      await setSelectImg(path)
      await toggleModal()
    } catch (err) {
      Alert.alert("선택된 이미지가 없습니다.", "다시 확인해주세요.", [
        {
          text: "확인",
        },
      ])
    }
  }

  const onRefresh = () => {
    getReviewListHandler()
  }

  const setReply = () => {
    if (selectReply === null || selectReply === "") {
      Alert.alert("답변 내용을 입력해주세요.", "", [
        {
          text: "확인",
        },
      ])
    } else {
      const param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        bo_table: "review",
        it_id: ItId,
        wr_id: WrId,
        mode: "comment",
        wr_content: selectReply,
        wr_name: mt_name,
      }

      Api.send("store_review_comment", param, args => {
        const resultItem = args.resultItem
        let arrItems = args.arrItems

        if (resultItem.result === "Y") {
          toggleCommentModal()
          getReviewList02Handler()
          setSelectReply("")
          Alert.alert("답변을 등록하였습니다.", "", [
            {
              text: "확인",
            },
          ])
        } else {
          getReviewList02Handler()
          setSelectReply("")
          Alert.alert("답변을 등록하지 못하였습니다.", "답변을 등록하는데 문제가 있습니다.", [
            {
              text: "확인",
              onPress: () => toggleCommentModal(),
            },
          ])
        }
      })
    }
  }

  const [visible, setIsVisible] = React.useState(false)
  const [modalImages, setModalImages] = React.useState([])

  const replyDelete = (it_id, wr_id) => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      bo_table: "review",
      mode: "comment_delete",
      it_id: it_id,
      wr_id: wr_id,
    }

    Api.send("store_review_comment", param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === "Y") {
        getReviewList02Handler()
        Alert.alert("답변을 삭제하였습니다.", "", [
          {
            text: "확인",
          },
        ])
      } else {
        getReviewList02Handler()
        Alert.alert("답변을 삭제하지 못하였습니다.", "답변을 삭제하는데 문제가 있습니다.", [
          {
            text: "확인",
          },
        ])
      }
    })
  }

  const replayDelteHandler = (payload01, payload02) => {
    Alert.alert("해당 답변을 정말 삭제하시겠습니까?", "", [
      {
        text: "삭제하기",
        onPress: () => replyDelete(payload01, payload02),
      },
      {
        text: "취소",
      },
    ])
  }

  // 오른쪽에서 왼쪽으로 스와이프(swipe)시 액션
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0],
      // inputRange: [0, 50, 100, 101],
      // outputRange: [-20, 0, 0, 0],
    })
    return (
      <RectButton style={styles.leftAction}>
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              ...BaseStyle.container5,
              ...BaseStyle.ph20,
              backgroundColor: "#fff",
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: "center" }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>맛</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{rate.wr_score1}</Text>
          </View>
          <View style={{ width: 1, height: "50%", backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: "center" }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>또 주문</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{rate.wr_score2}</Text>
          </View>
          <View style={{ width: 1, height: "50%", backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: "center" }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>빠른배달</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{rate.wr_score3}</Text>
          </View>
          <View style={{ width: 1, height: "50%", backgroundColor: Primary.PointColor01 }} />
          <View style={{ ...BaseStyle.container2, flex: 1, justifyContent: "center" }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>가성비</Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{rate.wr_score4}</Text>
          </View>
        </Animated.View>
      </RectButton>
    )
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={index + item.wr_id}>
        <View style={{ height: 10, width: "100%", backgroundColor: "#F2F2F2" }} />
        <View style={{ ...BaseStyle.mv20, ...BaseStyle.container, ...BaseStyle.ph20 }}>
          <View style={{ ...BaseStyle.mr10 }}>
            <Image
              source={{ uri: `${item.profile}` }}
              style={{ width: 55, height: 55, borderRadius: 55 }}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1, ...BaseStyle.mb3 }}>
              {item.menu}
            </Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb3 }}>{item.wr_mb_id}</Text>
            <View style={{ ...BaseStyle.container }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>
                {moment(item.datetime, "YYYYMMDD").fromNow()}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.mb20 }}>
          <View
            style={{
              flex: 1,
              ...BaseStyle.container2,
              ...BaseStyle.mr5,
              ...BaseStyle.pv10,
              borderWidth: 1,
              borderColor: item.wr_score1 === "1" ? "#222" : "#E3E3E3",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko16,
                ...BaseStyle.font_bold,
                ...BaseStyle.mb5,
                color: item.wr_score1 === "1" ? "#222" : "#E3E3E3",
              }}
            >
              맛
            </Text>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: item.wr_score1 === "1" ? "#222" : "#E3E3E3",
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ ...BaseStyle.ko10, color: "#fff" }}>BEST</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              ...BaseStyle.container2,
              ...BaseStyle.mr5,
              ...BaseStyle.pv10,
              borderWidth: 1,
              borderColor: item.wr_score2 === "1" ? "#222" : "#E3E3E3",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko16,
                ...BaseStyle.font_bold,
                ...BaseStyle.mb5,
                color: item.wr_score2 === "1" ? "#222" : "#E3E3E3",
              }}
            >
              또주문
            </Text>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: item.wr_score2 === "1" ? "#222" : "#E3E3E3",
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ ...BaseStyle.ko10, color: "#fff" }}>BEST</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              ...BaseStyle.container2,
              ...BaseStyle.mr5,
              ...BaseStyle.pv10,
              borderWidth: 1,
              borderColor: item.wr_score3 === "1" ? "#222" : "#E3E3E3",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko16,
                ...BaseStyle.font_bold,
                ...BaseStyle.mb5,
                color: item.wr_score3 === "1" ? "#222" : "#E3E3E3",
              }}
            >
              빠른배달
            </Text>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: item.wr_score3 === "1" ? "#222" : "#E3E3E3",
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ ...BaseStyle.ko10, color: "#fff" }}>BEST</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              ...BaseStyle.container2,
              ...BaseStyle.pv10,
              borderWidth: 1,
              borderColor: item.wr_score4 === "1" ? "#222" : "#E3E3E3",
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko16,
                ...BaseStyle.font_bold,
                ...BaseStyle.mb5,
                color: item.wr_score4 === "1" ? "#222" : "#E3E3E3",
              }}
            >
              가성비
            </Text>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: item.wr_score4 === "1" ? "#222" : "#E3E3E3",
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
            >
              <Text style={{ ...BaseStyle.ko10, color: "#fff" }}>BEST</Text>
            </View>
          </View>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center", ...BaseStyle.mb10 }}>
          {item.pic.length > 1 ? (
            <View style={{ width: Dimensions.get("window").width, ...BaseStyle.ph20 }}>
              <Swiper
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: 250,
                }}
                dotColor="#fff"
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
                      let formatImg = item.pic.map(v => {
                        return { uri: v }
                      })
                      setModalImages(formatImg)
                    }}
                  >
                    <Image
                      source={{ uri: `${image}` }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="cover"
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
                  let formatImg = item.pic.map(v => {
                    return { uri: v }
                  })
                  setModalImages(formatImg)
                }}
              >
                <Image
                  source={{ uri: `${item.pic[0]}` }}
                  style={{
                    width: Dimensions.get("window").width - 40,
                    height: 250,
                    resizeMode: "cover",
                    marginBottom: 5,
                  }}
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
          ) : null}
        </View>

        <View style={{ ...BaseStyle.mb30, ...BaseStyle.ph20 }}>
          {item.reply ? (
            <View
              style={{
                ...BaseStyle.ph20,
                ...BaseStyle.pv20,
                backgroundColor: Primary.PointColor02,
                borderRadius: 10,
                position: "relative",
              }}
            >
              <View style={{ ...BaseStyle.container3 }}>
                <View>
                  <View
                    style={{ ...BaseStyle.container, ...BaseStyle.mb10, alignItems: "baseline" }}
                  >
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.font_222,
                        ...BaseStyle.mr10,
                      }}
                    >
                      {mt_store}
                    </Text>
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_666 }}>
                      {moment(item.replayDate).format("YYYY.MM.DD  a h:mm ")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...BaseStyle.ko15,
                      ...BaseStyle.lh22,
                      ...BaseStyle.font_white,
                      width: "100%",
                      flexWrap: "wrap",
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
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <Image
                  source={require("../images/popup_close.png")}
                  style={{ width: 22, height: 22, opacity: 0.5 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : (
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
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#20ABC8",
                  height: 50,
                  width: "50%",
                  borderRadius: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Image
                  source={require("../images/reply_wh.png")}
                  style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                  resizeMode="contain"
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
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e5e5e5",
                  height: 50,
                  width: "50%",
                  borderRadius: 0,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Image
                  source={require("../images/bell.png")}
                  style={{ width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }}
                  resizeMode="contain"
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

  const swipeBtns = [
    {
      text: "자세히",
      component: (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 2,
            paddingHorizontal: 5,
            backgroundColor: "#ececec",
            borderRadius: 5,
          }}
        >
          <Text style={{ ...BaseStyle.ko10 }}>자세히보기</Text>
        </TouchableOpacity>
      ),
      color: "#222",
      backgroundColor: "transparent",
      underlayColor: "rgba(0, 0, 0, 1, 0.6)",
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ zIndex: 99999, backgroundColor: "#fff" }}>
        <Header navigation={navigation} title="리뷰관리" />
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
        <AutoHeightImage source={{ uri: `${selectImg}` }} width={Dimensions.get("window").width} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleModal}
          style={{
            position: "absolute",
            top: 70,
            right: 10,
          }}
        >
          <Image
            source={require("../images/ic_del.png")}
            style={{ width: 30, height: 30, resizeMode: "contain" }}
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
        animationIn="bounceInUp"
        animationInTiming={300}
      >
        <KeyboardAvoidingView
          behavior="position"
          style={{ backgroundColor: "#fff", borderRadius: 15 }}
          enabled
        >
          <View
            style={{
              position: "relative",
              backgroundColor: "#fff",
              ...BaseStyle.pv30,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb15, ...BaseStyle.font_bold }}>
              리뷰에 대한 답변을 입력해주세요.
            </Text>
            <View style={{ width: "100%", ...BaseStyle.ph30 }}>
              <View style={{ ...BaseStyle.ph10, backgroundColor: "#f5f5f5", borderRadius: 5 }}>
                <TextInput
                  value={selectReply}
                  style={{
                    width: "100%",
                    ...BaseStyle.ko15,
                    ...BaseStyle.lh24,
                    ...BaseStyle.mv15,
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholder="답변을 입력해주세요."
                  underlineColorAndroid="transparent"
                  onChangeText={text => setSelectReply(text)}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph30 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (selectReply !== null && selectReply !== "") {
                    setReply()
                  }
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  borderWidth: 1,
                  borderColor: selectReply !== null && selectReply !== "" ? "#20ABC8" : "#e5e5e5",
                  backgroundColor: selectReply !== null && selectReply !== "" ? "#20ABC8" : "#fff",
                  paddingVertical: 15,
                  flex: 1,
                  ...BaseStyle.pv15,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_bold,
                    color: selectReply !== null && selectReply !== "" ? "#222" : "#e5e5e5",
                  }}
                >
                  답변 전송
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={toggleCommentModal}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#e5e5e5",
                  backgroundColor: "#e5e5e5",
                  paddingVertical: 15,
                  flex: 1,
                  ...BaseStyle.pv15,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    color: "#666",
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
      {JSON.stringify(rate) !== "{}" ? (
        <Animated.View
          style={{
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "#fff",
            // opacity: opacity,
            transform: [
              {
                translateY: translation,
              },
            ],
          }}
        >
          {/* <Swipeout right={swipeBtns} autoClose="true" backgroundColor="transparent"> */}
          <Swipeable renderRightActions={renderRightActions}>
            <View
              style={{
                ...styles.rectButton,
                width: "100%",
                ...BaseStyle.container5,
                ...BaseStyle.pv15,
                ...BaseStyle.ph10,
              }}
            >
              <View style={{ ...BaseStyle.container }}>
                <Image
                  source={require("../images/thumbup.png")}
                  style={{ width: 50, height: 30 }}
                  resizeMode="cover"
                />
                <Animated.Text
                  style={{
                    ...BaseStyle.ko20,
                    ...BaseStyle.font_bold,
                    marginRight: 2,
                    transform: [
                      {
                        scale: scale,
                      },
                    ],
                  }}
                >
                  {rate.max_score_value}
                </Animated.Text>
                <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>
                  {rate.max_score_value === "맛"
                    ? "이 최고에요!"
                    : rate.max_score_value === "또 주문"
                    ? "할게요!"
                    : rate.max_score_value === "빠른배달"
                    ? "좋아요!"
                    : rate.max_score_value === "가성비"
                    ? "갑이에요!"
                    : null}
                </Text>
              </View>
              <View style={{ ...BaseStyle.container5, alignSelf: "flex-end" }}>
                <View style={{ ...BaseStyle.container, ...BaseStyle.mh05 }}>
                  <Text style={{ ...BaseStyle.ko14 }}>맛 </Text>
                  <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>
                    {rate.wr_score1}
                  </Text>
                </View>
                {/* <View
                  style={{width: 1, height: 30, backgroundColor: '#E3E3E3', ...BaseStyle.mh05}}
                />
                <View style={{...BaseStyle.container, ...BaseStyle.mh05}}>
                  <Text style={{...BaseStyle.ko14}}>합계 </Text>
                  <Text style={{...BaseStyle.ko16, ...BaseStyle.font_bold}}>{rate.total_cnt}</Text>
                </View> */}
                <Image
                  source={require("../images/swipe_m.png")}
                  style={{ width: 50, height: 25, marginLeft: 10 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Swipeable>
          {/* </Swipeout> */}
          <View style={{ height: 1, backgroundColor: "#e5e5e5" }} />
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
                    y: scrolling,
                  },
                },
              },
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
          style={{ backgroundColor: "#fff", width: "100%" }}
          ListHeaderComponent={
            <View>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  ...BaseStyle.ph20,
                  ...BaseStyle.mt20,
                }}
              >
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_666, ...BaseStyle.mb10 }}>
                  총 리뷰 & 평점
                </Text>
                <Text style={{ ...BaseStyle.ko20, ...BaseStyle.font_bold }}>{mt_store}</Text>
              </View>
              {JSON.stringify(rate) !== "{}" ? (
                <View
                  style={{
                    ...BaseStyle.container,
                    ...BaseStyle.ph20,
                    ...BaseStyle.pt10,
                    ...BaseStyle.pb20,
                  }}
                >
                  <View style={{ flex: 3 }}>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per1 ? rate.rating_per1 : 0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        맛 {rate.wr_score1 ? rate.wr_score1 : "0"}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per2 ? rate.rating_per2 : 0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        또 주문 {rate.wr_score2 ? rate.wr_score2 : "0"}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per3 ? rate.rating_per3 : 0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        빠른배달 {rate.wr_score3 ? rate.wr_score3 : "0"}
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container }}>
                      <Progress.Bar
                        animated
                        progress={rate.rating_per4 ? rate.rating_per4 : 0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        가성비 {rate.wr_score4 ? rate.wr_score4 : "0"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 1,
                      height: "100%",
                      backgroundColor: "#ececec",
                      ...BaseStyle.pv20,
                      ...BaseStyle.mh30,
                      ...BaseStyle.mr10,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      height: "100%",
                      ...BaseStyle.pt10,
                    }}
                  >
                    <Image
                      source={require("../images/thumbup.png")}
                      style={{ width: "100%", height: 70 }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        ...BaseStyle.ko20,
                        fontWeight: "bold",
                        fontSize: rate.max_score_value === "맛" ? 22 : 20,
                        color: "#222",
                      }}
                    >
                      {rate.max_score_value ? rate.max_score_value : "-"}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    ...BaseStyle.container,
                    ...BaseStyle.ph20,
                    ...BaseStyle.pt10,
                    ...BaseStyle.pb20,
                  }}
                >
                  <View style={{ flex: 3 }}>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        맛 0
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        또 주문 0
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                      <Progress.Bar
                        animated
                        progress={0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        빠른배달 0
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container }}>
                      <Progress.Bar
                        animated
                        progress={0}
                        width={150}
                        height={10}
                        color={Primary.PointColor01}
                        borderColor="#fff"
                        borderRadius={10}
                        style={{ backgroundColor: "#F2F2F2" }}
                      />
                      <Text
                        style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.ml10 }}
                      >
                        가성비 0
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 1,
                      height: "100%",
                      backgroundColor: "#ececec",
                      ...BaseStyle.pv20,
                      ...BaseStyle.mh30,
                      ...BaseStyle.mr10,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      height: "100%",
                      ...BaseStyle.pt10,
                    }}
                  >
                    <Image
                      source={require("../images/thumbup.png")}
                      style={{ width: "100%", height: 70 }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{
                        ...BaseStyle.ko20,
                        fontWeight: "bold",
                        fontSize: 22,
                        color: "#222",
                      }}
                    >
                      -
                    </Text>
                  </View>
                </View>
              )}

              {/* 공지글 작성 */}
              {notice !== null && notice !== "" ? (
                <>
                  <View
                    style={{
                      ...BaseStyle.mh20,
                      ...BaseStyle.mb10,
                      ...BaseStyle.pb10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#ececec",
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ececec",
                        width: "100%",
                        ...BaseStyle.pv10,
                      }}
                    >
                      <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>
                        리뷰 공지사항
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
                      <Text style={{ ...BaseStyle.ko14 }}>{notice.noticeContent}</Text>
                    </View>
                    {notice.noticePic && notice.noticePic.length > 0
                      ? notice.noticePic.map((pic, index) => (
                          <AutoHeightImage
                            key={`${pic}-${index}`}
                            source={{ uri: `${pic}` }}
                            width={Dimensions.get("window").width - 60}
                          />
                        ))
                      : null}
                  </View>
                  <View style={{ ...BaseStyle.ph20, ...BaseStyle.pb20 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("ReviewNotice", { type: "edit", item: notice })
                      }
                      style={{
                        ...BaseStyle.mainBtn,
                      }}
                    >
                      <Text
                        style={{
                          ...BaseStyle.ko14,
                          ...BaseStyle.font_bold,
                          ...BaseStyle.font_white,
                        }}
                      >
                        리뷰 공지 수정
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={{ ...BaseStyle.ph20, ...BaseStyle.pb20 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("ReviewNotice", { type: "write" })}
                    style={{
                      ...BaseStyle.mainBtn,
                    }}
                  >
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.font_white,
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
              <Text style={{ ...BaseStyle.ko15, textAlign: "center" }}>
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
    backgroundColor: "white",
    justifyContent: "center",
  },
  actionText: {
    color: "black",
    fontSize: 16,
  },
  rectButton: {
    width: "100%",
    backgroundColor: "white",
  },
  emptyView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 100,
  },
})

export default Reviews
