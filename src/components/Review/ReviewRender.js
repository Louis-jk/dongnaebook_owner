import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import StarRating from 'react-native-star-rating'
import ImageView from 'react-native-image-viewing'
import moment from 'moment'
import 'moment/locale/ko'
import Swiper from 'react-native-swiper'
import BaseStyle, {Disable, Primary, Warning} from '../../styles/Base';
import Divider from '../Divider';

const ReviewRender = ({
  item,
  imageLoad,
  setImageLoad,
  modalImages,
  setModalImages,
  visible,
  setIsVisible,
  mtStore,
  setItId,
  setWrId,
  toggleCommentModal,
  replyDeleteHandler,
  toggleSpamModal
}) => {
    return (
        <View>        
          <Divider height={10} backgroundColor='#F2F2F2' />

          <View style={[styles.basicContainer, styles.reviewProfileWrap]}>
            <View style={styles.reviewProfileThumbWrap}>
              <Image
                source={{ uri: `${item.profile}` }}
                style={styles.reviewProfileThumbnail}
                resizeMode='cover'
              />
            </View>

            <View>
              <Text style={styles.reviewProfileUserId}>{item.wr_mb_id}</Text>
              <View style={styles.basicContainer}>
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1, ...BaseStyle.mr15 }}>
                  {moment(item.datetime, 'YYYYMMDD').fromNow()}
                </Text>
                <StarRating
                  activeOpacity={1}
                  disabled={false}
                  emptyStar={require('../../images/ico_star_off.png')}
                  fullStar={require('../../images/ico_star_on.png')}
                  ratingColor={Primary.PointColor01}
                  ratingBackgroundColor={Disable.lightGray}
                  maxStars={5}
                  rating={item.rating}
                  starSize={15}
                />
              </View>
            </View>
          </View>

          <View style={styles.reviewContentWrap}>
            <Text>{item.content}</Text>
          </View>

          <View style={[styles.basicContainer02, {...BaseStyle.mb10 }]}>
            {item.pic.length > 1 && (
              <View style={{ width: Dimensions.get('window').width, ...BaseStyle.ph20 }}>
                <Swiper
                  style={styles.swiperWrap}
                  dotColor='#fff'
                  dotStyle={styles.dotStyle}
                  activeDotStyle={styles.activeDotStyle}
                  showsPagination
                  horizontal
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
                      {imageLoad && (
                        <View style={styles.imageLoadStyle}>
                          <ActivityIndicator color={Primary.PointColor01} />
                        </View>
                      )}

                      <Image
                        source={{ uri: `${image}` }}
                        style={styles.swiperImg}
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
                    <View style={styles.imageLoadStyle}>
                      <ActivityIndicator color={Primary.PointColor01} />
                    </View>
                  )}
                  <Image
                    source={{ uri: `${item.pic[0]}` }}
                    style={[styles.oneImg, styles.swiperWrap]}
                    resizeMode='cover'
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

          <View style={styles.replyContainer}>
            {item.reply && (
              <View
                style={styles.replyWrap}
              >
                <View style={styles.basicContainer}>
                  <View>
                    <View
                      style={[styles.basicContainer, styles.replyInner]}
                    >
                      <Text
                        style={styles.replyStoreName}
                      >
                        {mtStore}
                      </Text>
                      <Text style={styles.replyDate}>
                        {moment(item.replayDate).format('YYYY.MM.DD  a h:mm ')}
                      </Text>
                    </View>
                    <Text
                      style={styles.replyContent}
                    >
                      {item.replyComment}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => replyDeleteHandler(item.it_id, item.wr_id)}
                  hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  style={{ position: 'absolute', top: 10, right: 10 }}
                >
                  <Image
                    source={require('../../images/popup_close.png')}
                    style={{ width: 22, height: 22, opacity: 0.5 }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            )}

            {!item.reply && (
              <View style={styles.basicContainer}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setItId(item.it_id)
                    setWrId(item.wr_id)
                    toggleCommentModal()
                    // setReply(item.it_id, item.wr_id)
                  }}
                  style={[styles.basicContainer00, replyButtonStyle('left').replyButton]}
                >
                  <Image
                    source={require('../../images/reply_wh.png')}
                    style={styles.replyGeneralIconImg}
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
                    }
                  }}
                  style={[styles.basicContainer00, replyButtonStyle('right', item.wr_singo).replyButton]}
                >
                  {item.wr_singo === 'N' && (
                    <Image
                      source={require('../../images/bell.png')}
                      style={styles.replySingoIconImg}
                      resizeMode='contain'
                    />
                  )}
                  {item.wr_singo === 'Y' && (
                    <Image
                      source={require('../../images/bell_wh.png')}
                      style={styles.replySingoIconImg}
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
    );
}

const styles = StyleSheet.create({
  basicContainer: {...BaseStyle.container},
  basicContainer00: {...BaseStyle.container0},
  basicContainer02: {...BaseStyle.container2},
  reviewProfileWrap: {...BaseStyle.mv20, ...BaseStyle.ph20},
  reviewProfileThumbWrap: {...BaseStyle.mr10},
  reviewProfileThumbnail: {width: 55, height: 55, borderRadius: 55},
  reviewProfileUserId: {...BaseStyle.ko15, ...BaseStyle.mb5},
  reviewContentWrap: {...BaseStyle.ph20, ...BaseStyle.mb10},
  imageLoadStyle: {position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 0},
  swiperWrap: {height: 250},
  swiperImg: {width: '100%', height: '100%'},
  oneImg: {width: Dimensions.get('window').width - 40, marginBottom: 5},
  dotStyle: {width: 7, height: 7, borderRadius: 7, bottom: -15},
  activeDotStyle: {width: 7, height: 7, backgroundColor: Primary.PointColor01, bottom: -15},
  replyContainer: {...BaseStyle.mb30, ...BaseStyle.ph20},
  replyWrap: { ...BaseStyle.ph20, ...BaseStyle.pv20, backgroundColor: Disable.lightGray, borderRadius: 5, position: 'relative'},
  replyInner: { ...BaseStyle.mb10, alignItems: 'baseline' },
  replyStoreName: { ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222, ...BaseStyle.mr10 },
  replyDate: { ...BaseStyle.ko14, ...BaseStyle.font_666 },
  replyContent: { ...BaseStyle.ko15, ...BaseStyle.lh22, width: '100%', flexWrap: 'wrap' },
  replyGeneralIconImg: { width: 18, height: 18, ...BaseStyle.mr10, marginTop: -2 },
  replySingoIconImg: { width: 20, height: 20, ...BaseStyle.mr10, opacity: 0.7 }
})

const replyButtonStyle = (position, singo) => StyleSheet.create({
  replyButton: { 
    flex: 1, 
    height: 45, 
    borderRadius: 0,
    borderTopLeftRadius: position === 'left' ? 5 : 0,
    borderBottomLeftRadius: position === 'left' ? 5 : 0,
    borderTopRightRadius: position === 'right' ? 5 : 0,
    borderBottomRightRadius: position === 'right' ? 5 : 0,
    backgroundColor: position === 'left' ? Primary.PointColor01 : position === 'right' && singo === 'N' ? Disable.darkGray : Warning.redColor
  }
})

export default ReviewRender;
