import ImagePicker from 'react-native-image-crop-picker' // 이미지 업로드 패키지

// 이미지 업로드
export const pickGalleryImage = (setSource, setMenuImage, width = 400) => {
  ImagePicker.openPicker({
    mediaType: 'photo',
    sortOrder: 'none',
    width,
    height: 300,
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
      // dispatch(UserProfileImg(img.path));
      setSource({
        uri: img.path,
        type: img.mime,
        name: img.path.slice(img.path.lastIndexOf('/'))
      })
      setMenuImage(img.path)
    })
    .catch(e => console.log(e))
}


// 카메라 촬영
export const takeCamera = (setSource, setMenuImage) => {
  ImagePicker.openCamera({
    width: 2000,
    height: 1500,
    cropping: true
  }).then(img => {
    setSource({
      uri: img.path,
      type: img.mime,
      name: img.path.slice(img.path.lastIndexOf('/'))
    })
    setMenuImage(img.path)
  })
}
