import React from "react"
import { Platform, Alert, Linking, View, Image, ActivityIndicator } from "react-native"
import { Toast } from "native-base"
import jwt_decode from "jwt-decode"
import cusToast from "./components/CusToast"
import Axios from "axios"
import { API_URL, SERVER_NAME, SECRET_KEY } from '@env'
// import ImageEditor from "@react-native-community/image-editor";
var RNFS = require("react-native-fs")

//var jwt = require('jwt-simple');
//var payload = { foo: 'bar' };
//var secret = 'xxx';
//var token = jwt.encode(payload, secret);

/*
const sign = require('jwt-encode');
const secret = 'secret';
const data = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022
};
const jwt = sign(data, secret);
console.log(jwt);
*/

class Api {
  constructor() {
    //super(props);

    this.state = {
      isLoading: false,
      SERVER_NAME: SERVER_NAME,
      SECRETKEY: SECRET_KEY,
      url: API_URL,
      path: "",
      option: {
        method: "POST",
        headers: {
          //Accept: 'application/json',
          "Content-Type": "multipart/form-data;charset=UTF-8",
        },
        body: null,
      },
      dataSource: {},
    }
  }

  //formdata 로 변경
  makeFormData(method = "", datas) {
    let formdata = new FormData()
    formdata.append("method", method)
    formdata.append("secretKey", this.state.SECRETKEY)
    formdata.append("jwt_data", datas)

    this.state.path = "/api/proc_" + method + ".php"
    this.state.option.body = formdata
  }

  //formdata 로 변경 jwt없이
  makeFormData2(method = "", datas) {
    let formdata = new FormData()
    formdata.append("method", method)
    formdata.append("secretKey", SECRET_KEY)
    for (let [key, value] of Object.entries(datas)) {
      formdata.append(key, value)
    }

    this.state.path = "/api/proc_" + method + ".php"
    this.state.option.body = formdata
  }

  //기본
  send(method, datas, callback) {
    const jwt = require("jwt-encode")
    const jwt_secret = this.state.SECRETKEY
    const jwt_data = jwt(datas, jwt_secret)

    this.makeFormData(method, jwt_data)

    this.state.isLoading = true

    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then(response => {
        
        const decoded_jwt = jwt_decode(response.data.jwt, jwt_secret)
        //console.warn(decoded_jwt);
        /*
                let resultItem = response.data.resultItem.result;
                let message = response.data.resultItem.message;
                let arrItems = response.data.arrItems;
                */
        let resultItem = decoded_jwt.resultItem.result
        let message = decoded_jwt.resultItem.message
        let sql = decoded_jwt.resultItem.sql
        let arrItems = decoded_jwt.arrItems

        let returnJson = {
          resultItem: { result: resultItem === "false" ? "N" : "Y", message: message, sql: sql },
          arrItems: arrItems,
        }
        this.state.isLoading = false
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        if (resultItem === "N" && message) {
          //console.log(method, message);
          if (!(method === "proc_check_reserve")) {
            cusToast(message)
          }
        }

        if (typeof callback == "function") {
          callback(returnJson)
        } else {
          return returnJson
        }
      })
      .catch(function (error) {
        console.log("Axios catch!!!>>", method, error)
      })
  }

  //기본02
  send2(method, datas, callback) {
    // console.log('method', method);
    // console.log('datas', datas);

    this.makeFormData2(method, datas)

    this.state.isLoading = true

    // console.log("all >>>>>>>>>", this.state.url + this.state.path, this.state.option.body, this.state.option.headers);
    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then(response => {
        let resultItem = response.data.resultItem.result
        let message = response.data.resultItem.message
        let sql = response.data.resultItem.sql
        let arrItems = response.data.arrItems

        let returnJson = {
          resultItem: { result: resultItem === "false" ? "N" : "Y", message: message, sql: sql },
          arrItems: arrItems,
        }
        this.state.isLoading = false
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        if (resultItem === "N" && message) {
          //console.log(method, message);
          if (!(method === "proc_check_reserve")) {
            cusToast(message)
          }
        }

        if (typeof callback == "function") {
          callback(returnJson)
        } else {
          return returnJson
        }
      })
      .catch(function (error) {
        console.log("Axios catch!!!>>", method, error)
      })
  }

  //formdata 로 변경
  makeFormData3(method = "", datas, filedatas) {
    
    let formdata = new FormData()
    formdata.append("method", method)
    formdata.append("secretKey", SECRET_KEY)
    formdata.append("jwt_data", datas)

    for (let [key, value] of Object.entries(filedatas)) {
      formdata.append(key, value)
    }

    this.state.path = "/api/proc_" + method + ".php"
    this.state.option.body = formdata

    
  }

  // 기본03
  send3(method, datas, filedatas, callback) {
    //console.log(datas);
    const jwt = require("jwt-encode")
    const jwt_secret = this.state.SECRETKEY
    const jwt_data = jwt(datas, jwt_secret)
    //console.log("jwtData : " + jwt_data);

    

    this.makeFormData3(method, jwt_data, filedatas)

    this.state.isLoading = true

    
    return Axios.post(
      this.state.url + this.state.path,
      this.state.option.body,
      this.state.option.headers
    )
      .then(response => {
        //console.log(response);
        const decoded_jwt = jwt_decode(response.data.jwt, jwt_secret)

        let resultItem = decoded_jwt.resultItem.result
        let message = decoded_jwt.resultItem.message
        let sql = decoded_jwt.resultItem.sql
        let arrItems = decoded_jwt.arrItems

        let returnJson = {
          resultItem: { result: resultItem === "false" ? "N" : "Y", message: message, sql: sql },
          arrItems: arrItems,
        }
        this.state.isLoading = false
        // this.state.dataSource = arrItems;
        //각 메소드별로 값을 저장해둠.

        //console.log(resultItem);

        if (resultItem === "N" && message) {
          //console.log(method, message);
          if (!(method === "proc_check_reserve")) {
            cusToast(message)
          }
        }

        if (typeof callback == "function") {
          callback(returnJson)
        } else {
          return returnJson
        }
      })
      .catch(function (error) {
        console.log("Axios catch!!!>>", method, error)
      })
  }

  loadingView() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ActivityIndicator />
      </View>
    )
  }

  //--------------------------------------------------------------------------------------------------
  formatDate(date) {
    var currentYear = date.getFullYear()
    var currentMonth = date.getMonth() + 1
    var currentDate = date.getDate()

    if (currentMonth < 10) currentMonth = "0" + currentMonth
    if (currentDate < 10) currentDate = "0" + currentDate

    return currentYear + "-" + currentMonth + "-" + currentDate
  }
  formatDateTime(date, format) {
    var currentYear = date.getFullYear()
    var currentMonth = date.getMonth() + 1
    var currentDate = date.getDate()

    var currentHours = date.getHours()
    var currentMinutes = date.getMinutes()
    var currentSeconds = date.getSeconds()

    var hours = currentHours
    var minutes = currentMinutes

    if (currentMonth < 10) currentMonth = "0" + currentMonth
    if (currentDate < 10) currentDate = "0" + currentDate
    if (currentHours < 10) currentHours = "0" + currentHours
    if (currentMinutes < 10) currentMinutes = "0" + currentMinutes
    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds

    if (format === "YmdHis") {
      return (
        currentYear +
        "" +
        currentMonth +
        "" +
        currentDate +
        "" +
        currentHours +
        "" +
        currentMinutes +
        "" +
        currentSeconds
      )
    } else if (format === "Ymd") {
      return currentYear + "" + currentMonth + "" + currentDate
    } else if (format === "H:i") {
      return currentHours + ":" + currentMinutes
    } else if (format === "AMPM") {
      var ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes
      //hours + ':' + minutes + ' ' + ampm;

      return currentHours + ":" + currentMinutes + " " + ampm
    } else {
      return (
        currentYear +
        "-" +
        currentMonth +
        "-" +
        currentDate +
        " " +
        currentHours +
        ":" +
        currentMinutes
      )
    }
  }
  //--------------------------------------------------------------------------------------------------
  diffTime(start, end, format) {
    start = start.split(":")
    end = end.split(":")
    var startDate = new Date(0, 0, 0, start[0], start[1], 0)
    var endDate = new Date(0, 0, 0, end[0], end[1], 0)
    var diff = endDate.getTime() - startDate.getTime()
    var hours = Math.floor(diff / 1000 / 60 / 60)
    diff -= hours * 1000 * 60 * 60
    var minutes = Math.floor(diff / 1000 / 60)

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) hours = hours + 24
    // hours = ((hours <= 9 ? "0" : "") + hours);
    if (hours === "00") {
      hours = "0"
    }

    minutes = (minutes <= 9 ? "0" : "") + minutes
    if (minutes === "00") {
      minutes = ""
    }

    if (format === "H") {
      return hours ? hours : ""
    } else if (format === "i") {
      return minutes ? minutes : ""
    } else {
      return (hours ? hours + "시간 " : "") + (minutes ? minutes + "분" : "")
    }
  }
  //--------------------------------------------------------------------------------------------------
  //콤마찍기
  comma(str) {
    str = String(str)
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,")
  }
  //콤마풀기
  uncomma(str) {
    str = String(str)
    return str.replace(/[^\d]+/g, "")
  }
  //--------------------------------------------------------------------------------------------------
  // 전화번호 포맷
  phoneFomatter(num, type) {
    let formatNum = ""
    let stringNum = String(num)

    if (stringNum.length === 11) {
      if (type === 0) {
        formatNum = stringNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3")
      } else {
        formatNum = stringNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      }
    } else if (stringNum.length === 8) {
      formatNum = stringNum.replace(/(\d{4})(\d{4})/, "$1-$2")
    } else {
      if (stringNum.indexOf("02") === 0) {
        if (type === 0) {
          formatNum = stringNum.replace(/(\d{2})(\d{4})(\d{4})/, "$1-****-$3")
        } else {
          formatNum = stringNum.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3")
        }
      } else {
        if (type === 0) {
          formatNum = stringNum.replace(/(\d{3})(\d{3})(\d{4})/, "$1-***-$3")
        } else {
          formatNum = stringNum.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        }
      }
    }
    return formatNum
  }
  //--------------------------------------------------------------------------------------------------
  imgResize(imgWidth, imgHeight, maxWidth) {
    let width = 0,
      height = 0
    if (imgWidth > maxWidth) {
      width = maxWidth
      height = imgHeight * (maxWidth / imgWidth)
    } else {
      width = imgWidth
      height = imgHeight
    }
    width = parseInt(width)
    height = parseInt(height)

    return width + "," + height
  }
  //--------------------------------------------------------------------------------------------------
  // imgCrop(items){
  //   let newArray = items;
  //   let newArrayCrop = [];
  //   var maxWidth = 1200;

  //   items.map((item, i) => {
  //     Image.getSize(item, (width, height) => {

  //       let cropData = {
  //         offset: {x: 0, y: 0},
  //         size: {width: width, height: height},
  //         // displaySize: {width: maxWidth, height: maxWidth},
  //         resizeMode: 'cover'
  //       };

  //       if (width > maxWidth) {
  //         cropData.size.width = maxWidth;
  //         cropData.size.height = parseInt((maxWidth*height)/width);

  //         ImageEditor.cropImage(item, cropData).then(url => {
  //           console.log("Cropped image uri", url);
  //           newArray[i] = url;
  //           newArrayCrop.push(url);
  //         });

  //       } else {
  //         cropData.size.width = width;
  //         cropData.size.height = height;
  //       }
  //       console.log(cropData);
  //     });
  //   });

  //   return [newArray, newArrayCrop];
  // }
  //--------------------------------------------------------------------------------------------------
  imgRemove(item) {
    if (item.indexOf("/cache/") !== -1) {
      RNFS.exists(item)
        .then(result => {
          // console.log("file exists: ", result);
          if (result) {
            return (
              RNFS.unlink(item)
                .then(() => {
                  console.log("FILE DELETED")
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch(err => {
                  console.log("RNFS", err.message)
                })
            )
          }
        })
        .catch(err => {
          console.log("RNFS", err.message)
        })
    }
  }
  //--------------------------------------------------------------------------------------------------
  dialCall = number => {
    let phoneNumber = ""

    if (Platform.OS === "ios") {
      phoneNumber = `telprompt:${number}`
    } else {
      phoneNumber = `tel:${number}`
    }
    Linking.openURL(phoneNumber)
  }
  //--------------------------------------------------------------------------------------------------
  arrSearch = (nameKey, myArray) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i]
      }
    }
  }
  //--------------------------------------------------------------------------------------------------
}

export default Api = new Api()
