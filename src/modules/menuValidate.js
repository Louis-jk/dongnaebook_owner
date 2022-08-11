import cusToast from '../components/CusToast'

const checkMenuValidate = (selectCategory, name, salePrice) => {
  console.log('s', selectCategory)
  // const { selectCategory, name, salePrice } = props

  if (selectCategory === '' || selectCategory === null) {
    cusToast('분류를 선택해주세요.')
    return false
  } else if (name === '' || name === null) {
    cusToast('메뉴명을 입력해주세요.')
    return false
  } else if (salePrice === '' || salePrice === null) {
    cusToast('판매가격을 입력해주세요.')
    return false
  } else {
    return true
  }
}

export default checkMenuValidate
