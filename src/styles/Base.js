import React, { Component } from 'react'
import { StyleSheet, Dimensions, Platform } from 'react-native'
import { Fonts } from './Fonts'
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export const main = '#20ABC8' // #277BC0
export const mint = '#57CC99'
export const orange = '#FFB72B' // #FFCB42
export const grey = '#ececec'
export const disableGray = '#f5f5f5'
export const green = '#58BC1F'
export const red = '#E94560'
export const yellow = '#FFD24C'

export const Primary = {
  PointColor01: main,
  PointColor02: mint,
  PointColor03: grey,
  PointColor04: orange
}

export const Warning = {
  redColor: red,
  yellowColor: yellow
}

export const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    height: 45,
    color: '#000',
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    height: 45,
    color: 'black',
    paddingRight: 30 // to ensure the text is never behind the icon
  }
})

export default StyleSheet.create({
  h0: { fontSize: 20, lineHeight: 25 },
  h1: { fontSize: 18, lineHeight: 23 },
  h2: { fontSize: 15, lineHeight: 20 },
  h3: { fontSize: 13, lineHeight: 18 },
  h4: { fontSize: 12, lineHeight: 17 },

  mt24: { marginTop: 24 },
  mt44: { marginTop: 44 },
  mt88: { marginTop: 88 },
  ml24: { marginLeft: 24 },
  ml44: { marginLeft: 44 },
  ml88: { marginLeft: 88 },

  pt5: { paddingTop: 5 },
  pt10: { paddingTop: 10 },
  pt20: { paddingTop: 20 },
  pt24: { paddingTop: 24 },
  pt36: { paddingTop: 36 },
  pt44: { paddingTop: 44 },
  pt88: { paddingTop: 88 },

  p10: { padding: 10 },
  p20: { padding: 20 },

  mt3: { marginTop: 3 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mt30: { marginTop: 30 },
  mt40: { marginTop: 40 },
  mt50: { marginTop: 50 },

  mb3: { marginBottom: 3 },
  mb5: { marginBottom: 5 },
  mb7: { marginBottom: 7 },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mb30: { marginBottom: 30 },
  mb40: { marginBottom: 40 },
  mb50: { marginBottom: 50 },
  mb60: { marginBottom: 60 },
  mb70: { marginBottom: 70 },

  pb5: { paddingBottom: 5 },
  pb10: { paddingBottom: 10 },
  pb15: { paddingBottom: 15 },
  pb20: { paddingBottom: 20 },
  pb30: { paddingBottom: 30 },

  m10: { margin: 10 },
  mr5: { marginRight: 5 },
  mr10: { marginRight: 10 },
  mr15: { marginRight: 15 },
  mr20: { marginRight: 20 },
  mr25: { marginRight: 25 },
  mr30: { marginRight: 30 },
  mr35: { marginRight: 35 },
  mr40: { marginRight: 40 },
  mr50: { marginRight: 50 },
  pr10: { paddingRight: 10 },
  pr20: { paddingRight: 20 },
  pl3: { paddingLeft: 3 },
  pl5: { paddingLeft: 5 },
  pl8: { paddingLeft: 8 },
  pl10: { paddingLeft: 10 },
  pl15: { paddingLeft: 15 },
  pl20: { paddingLeft: 20 },
  pl30: { paddingLeft: 30 },
  pl40: { paddingLeft: 40 },
  pl50: { paddingLeft: 50 },
  pl60: { paddingLeft: 60 },

  ml3: { marginLeft: 3 },
  ml5: { marginLeft: 5 },
  ml8: { marginLeft: 8 },
  ml10: { marginLeft: 10 },
  ml15: { marginLeft: 15 },
  ml20: { marginLeft: 20 },
  ml30: { marginLeft: 30 },
  ml40: { marginLeft: 40 },
  ml50: { marginLeft: 50 },
  ml60: { marginLeft: 60 },
  ml65: { marginLeft: 65 },
  ml70: { marginLeft: 70 },

  ph5: { paddingHorizontal: 5 },
  ph10: { paddingHorizontal: 10 },
  ph13: { paddingHorizontal: 13 },
  ph15: { paddingHorizontal: 15 },
  ph20: { paddingHorizontal: 20 },
  ph30: { paddingHorizontal: 30 },
  ph40: { paddingHorizontal: 40 },
  ph50: { paddingHorizontal: 50 },
  ph60: { paddingHorizontal: 60 },

  pv2: { paddingVertical: 2 },
  pv5: { paddingVertical: 5 },
  pv7: { paddingVertical: 7 },
  pv10: { paddingVertical: 10 },
  pv13: { paddingVertical: 13 },
  pv15: { paddingVertical: 15 },
  pv18: { paddingVertical: 18 },
  pv20: { paddingVertical: 20 },
  pv25: { paddingVertical: 25 },
  pv30: { paddingVertical: 30 },
  pv40: { paddingVertical: 40 },
  pv50: { paddingVertical: 50 },

  mh05: { marginHorizontal: 5 },
  mh10: { marginHorizontal: 10 },
  mh20: { marginHorizontal: 20 },
  mh40: { marginHorizontal: 40 },

  mv5: { marginVertical: 5 },
  mv7: { marginVertical: 7 },
  mv10: { marginVertical: 10 },
  mv13: { marginVertical: 13 },
  mv15: { marginVertical: 15 },
  mv20: { marginVertical: 20 },
  mv30: { marginVertical: 30 },

  font_main: { color: main },
  font_blue: { color: '#167AC9' },
  font_pink: { color: '#FF14A9' },
  font_white: { color: '#fff' },
  font_deepred: { color: '#700303' },
  font_green: { color: '#1A4205' },
  font_black: { color: '#000' },
  font_gray_a1: { color: '#A1A1A1' },
  font_gray_a5: { color: '#A5A5A5' },
  font_bold: { fontFamily: Fonts.NotoSansB },
  font_999: { color: '#999' },
  font_777: { color: '#777' },
  font_111: { color: '#111' },
  font_222: { color: '#222' },
  font_333: { color: '#333' },
  font_666: { color: '#666' },
  font_under: { textDecorationLine: 'underline' },

  lh15: { lineHeight: 15 },
  lh17: { lineHeight: 17 },
  lh20: { lineHeight: 20 },
  lh21: { lineHeight: 21 },
  lh22: { lineHeight: 22 },
  lh23: { lineHeight: 23 },
  lh24: { lineHeight: 24 },
  lh28: { lineHeight: 28 },

  ls1: { letterSpacing: -1 },

  ko10: { fontSize: 10, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko11: { fontSize: 11, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko12: { fontSize: 12, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko13: { fontSize: 13, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko14: { fontSize: 14, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko15: { fontSize: 15, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko16: { fontSize: 16, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko18: { fontSize: 18, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko20: { fontSize: 20, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko22: { fontSize: 22, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko24: { fontSize: 24, paddingTop: 2, fontFamily: Fonts.NotoSansR },
  ko_medium: { fontFamily: Fonts.NotoSansM },
  ko_bold: { fontFamily: Fonts.NotoSansB },

  s_regular: { fontFamily: Fonts.SquadaOneR },
  c_regular: { fontFamily: Fonts.QuanticoR },
  c_italic: { fontFamily: Fonts.QuanticoI },
  c_bold: { fontFamily: Fonts.QuanticoB },
  c_bold_italic: { fontFamily: Fonts.QuanticoBI },

  // en13 : {fontSize: 13, fontFamily: Fonts.DomineR},
  // en15 : {fontSize: 15, fontFamily: Fonts.DomineR},
  // en16 : {fontSize: 16, fontFamily: Fonts.DomineR},
  // en18 : {fontSize: 18, fontFamily: Fonts.DomineR},
  // en20 : {fontSize: 20, fontFamily: Fonts.DomineR},
  // en26 : {fontSize: 26, fontFamily: Fonts.DomineR},
  // en35 : {fontSize: 35, fontFamily: Fonts.DomineR},
  // en38 : {fontSize: 38, fontFamily: Fonts.DomineR},
  // en42 : {fontSize: 42, fontFamily: Fonts.DomineR},

  // en_medium : {fontFamily: Fonts.DomineM},
  // en_sbold : {fontFamily: Fonts.DomineSB},
  // en_bold : {fontFamily: Fonts.DomineB},

  // header footer
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  container0: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  container1: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container2: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  container3: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' },
  container4: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  container5: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  container6: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  container7: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  container8: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' },

  containerBottom: { flex: 1, alignItems: 'stretch', justifyContent: 'flex-end' },
  header: { shadowColor: '#000000', elevation: 3, borderBottomWidth: 0 },
  headTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    color: '#222',
    /* textAlign: 'center', marginLeft: 24 */ marginLeft: 9
  },
  menuTrigger: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 48
  },
  headRight: {
    position: 'absolute',
    top: -2,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headLeft: { alignItems: 'center', justifyContent: 'center', width: 44 },
  headLeftIcn: {
    flexDirection: 'row',
    justifyContent: 'center' /* justifyContent: 'flex-start', paddingLeft: 6, */
  },
  headBack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    flexDirection: 'row'
  },
  footWr: {
    flex: 1,
    top: 1,
    paddingVertical: 0,
    flexDirection: 'row',
    backgroundColor: '#1F4C06',
    overflow: 'hidden'
  } /* overflow: 'hidden', borderTopLeftRadius:20, borderTopRightRadius:20, overflow:"hidden", */,
  footIcn: { width: 25, height: 25 },

  bg0: { backgroundColor: '#1A4205' },
  bg1: { backgroundColor: '#700303' },
  bg2: { backgroundColor: '#fff' },
  bg3: { backgroundColor: '#E93323' },
  bg4: { backgroundColor: '#888' },
  bg5: { backgroundColor: '#F5F5F5' },
  bg6: { backgroundColor: '#E8E8E8' },
  bg7: { backgroundColor: '#DEDEDE' },
  bg_gray: { backgroundColor: '#E3E3E3' },

  inputH: { height: 45 },
  border: { borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 5 },
  line01: { height: 1, width: '100%', backgroundColor: '#E3E3E3' },
  mainBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: main,
    paddingVertical: 14,
    borderRadius: 5
  },
  disableBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: disableGray,
    paddingVertical: 14,
    borderRadius: 5
  },
  mainBtnBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: main,
    paddingVertical: 18
  },
  secondBtnBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: mint,
    paddingVertical: 18
  },
  deleteBtnBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: red,
    paddingVertical: 18
  },
  disableBtnBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: disableGray,
    paddingVertical: 18
  },
  mainBorderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: main,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 5
  },
  mintBorderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: mint,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 5
  },
  mainBorderBtnText: {
    fontFamily: Fonts.NotoSansR,
    fontSize: 14,
    color: main
  },
  BorderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 5
  },

  round05: { borderRadius: 5 },

  textWhite: { color: '#fff' },
  textCenter: { alignItems: 'center', justifyContent: 'center' },

  // confirm
  confirm_btn: { width: '50%', alignItems: 'center', paddingVertical: 10 },

  // alert
  check_btn: { width: '100%', alignItems: 'center', paddingVertical: 10 },

  // row
  row: { flexDirection: 'row' },
  row_between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // img
  imgCover: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 0 },
  imgContain: { width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 0 },

  // button
  btnConfirm: { width: '100%' },
  btnConfirm1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnConfirm2: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  btnConfirm2In: {
    height: 70,
    backgroundColor: '#F8F8F8E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 0
  },

  // main menu
  main_li: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // reservation1
  stepTitle: { backgroundColor: '#F8F8F8', paddingVertical: 13 },

  // reservation2
  confirmIcon: { width: 80, height: 80, backgroundColor: '#F3F3F3', borderRadius: 40, padding: 20 },
  resBox1: { paddingVertical: 17, paddingHorizontal: 19, borderWidth: 1, borderColor: '#EEEEEE' },
  resBox2: {
    paddingVertical: 17,
    paddingHorizontal: 19,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderTopColor: '#fff'
  },

  // roominfo
  slideWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center'
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    width: '100%',
    height: 1,
    marginTop: 15,
    marginBottom: 15
  },
  cureSort: { position: 'absolute', paddingRight: 5, paddingVertical: 5 },

  // mypage
  list_item: { marginLeft: 0, paddingRight: 5, marginRight: 0, width: '100%' },
  list_right_img: { width: 10, height: 20, resizeMode: 'contain' },
  btGreen: { borderRadius: 20, alignItems: 'center', paddingRight: 10, paddingLeft: 5 },
  ticket_left: {
    width: '65%',
    zIndex: 9,
    borderWidth: 1,
    borderColor: '#eee',
    borderRightWidth: 0
  },
  ticket_right: {
    width: '35%',
    borderWidth: 1,
    borderColor: '#eee',
    zIndex: 9,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ticket_radius: {
    borderWidth: 1,
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    zIndex: 14,
    borderColor: '#eee',
    position: 'absolute',
    top: -25,
    right: -20,
    borderRadius: 20,
    borderTopWidth: 0
  },
  ticket_radius_bottom: {
    borderWidth: 1,
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    zIndex: 14,
    borderColor: '#eee',
    position: 'absolute',
    bottom: -25,
    right: -20,
    borderRadius: 20,
    borderTopWidth: 0
  },

  // ticket guide
  ticket_wrapper: {
    paddingVertical: 19,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  // list reservation
  res_list: { borderWidth: 1, borderColor: '#eee' },

  // list usage
  tab_box: {
    width: '32%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 13,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    marginBottom: 10
  },

  // board qa
  tab_qa: {
    width: '50%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 13,
    borderWidth: 2,
    borderColor: '#EEEEEE'
  },

  // 정보수정
  input: { paddingHorizontal: 20, width: '100%', alignItems: 'center' },

  // 약관동의
  img80: { width: 80, height: 80 },
  img50: { width: 50, height: 50, marginLeft: -25 },
  img30: { width: 30, height: 30, marginLeft: -15 }
})
