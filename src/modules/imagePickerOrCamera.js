import ImagePicker from 'react-native-image-crop-picker' // 이미지 업로드 패키지

/**
 * Props 항목
 * @param {React.Dispatch<React.SetStateAction<null>>} setSource 이미지 File객체를 담는 stateAction
 * @param {React.Dispatch<React.SetStateAction<string>>} setMenuImage 이미지 패스만 담는 stateAction
 * @param {number?} width optional 넓이 지정 (Default : 400)
 * @param {number?} height optional 높이 지정 (Default : 300)
 */
// 이미지 업로드
export const pickGalleryImage = (setSource, setMenuImage, width = 400, height = 300) => {
  
  setTimeout(() => {
  
    ImagePicker.openPicker({
      mediaType: 'photo',
      sortOrder: 'none',
      width,
      height,
      compressImageMaxWidth: 10000,
      compressImageMaxHeight: 10000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperCircleOverlay: false,
      useFrontCamera: false,
      // includeBase64: true,
      cropping: true
    })
      .then(img => {
        
        setSource({
          uri: img.path,
          type: img.mime,
          name: img.path.slice(img.path.lastIndexOf('/'))
        })
        setMenuImage(img.path)
      })
      .catch(e => console.log(e))

  }, 1000)
}

/**
 * Props 항목
 * @param {React.Dispatch<React.SetStateAction<null>>} setSource 이미지 File객체를 담는 stateAction
 * @param {React.Dispatch<React.SetStateAction<string>>} setMenuImage 이미지 패스만 담는 stateAction
 * @param {number?} width optional 넓이 지정 (Default : 400)
 * @param {number?} height optional 높이 지정 (Default : 300)
 */
// 카메라 촬영
export const takeCamera = (setSource, setMenuImage, width = 400, height = 300) => {

  setTimeout(() => {
    
    ImagePicker.openCamera({
      width, // 2000
      height, // 1500
      cropping: true
    }).then(img => {
      setSource({
        uri: img.path,
        type: img.mime,
        name: img.path.slice(img.path.lastIndexOf('/'))
      })
      setMenuImage(img.path)
    })

  }, 1000)
}
