import cusToast from '../components/CusToast'

export const checkCouponValidate = (type, name, minPrice, priceType, maxPrice, discountPrice, toIntDiscountPrice, maxDate, couponNameRef, couponMinPriceRef, couponMaxPriceRef, couponDiscountPriceRef, couponUseDayRef) => {
  if (type === null || type === '') {
    cusToast('구분을 선택해주세요.')
  } else if (name === null || name === '') {
    couponNameRef.current.focus()
    cusToast('쿠폰명을 입력해주세요.', 1000, 'top')
  } else if (minPrice === null || minPrice === '') {
    couponMinPriceRef.current.focus()
    cusToast('최소 주문 금액을 입력해주세요.', 1000, 'top')
  } else if (priceType === '1' && (maxPrice === null || maxPrice === '')) {
    couponMaxPriceRef.current.focus()
    cusToast('최대 할인 금액을 입력해주세요.', 1000, 'top')
  } else if (priceType === '1' && maxPrice <= 0) {
    couponMaxPriceRef.current.focus()
    cusToast('최대 할인 금액은 0원 이상으로 입력해주세요.', 1000, 'top')
  } else if (discountPrice === null || discountPrice === '') {
    if (priceType === '0') {
      couponDiscountPriceRef.current.focus()
      cusToast('할인 금액을 입력해주세요.', 1000, 'top')
    } else {
      couponDiscountPriceRef.current.focus()
      cusToast('할인 비율을 입력해주세요.', 1000, 'top')
    }
  } else if (toIntDiscountPrice <= 0) {
    if (priceType === '0') {
      couponDiscountPriceRef.current.focus()
      cusToast('할인 금액은 0원 이상으로 설정해주세요.', 1000, 'top')
    } else {
      couponDiscountPriceRef.current.focus()
      cusToast('할인 비율은 0% 이상 100% 이하로 설정해주세요.', 1000, 'top')
    }
  } else if (maxDate === null || maxDate === '') {
    couponUseDayRef.current.focus()
    cusToast('쿠폰 사용기간을 입력해주세요.', 1000, 'top')
  } else {
    return true
  }
}
