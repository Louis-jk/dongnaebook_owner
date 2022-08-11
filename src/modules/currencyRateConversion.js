import cusToast from '../components/CusToast'

const CurrencyRateConversion = (payload, discountPrice) => (setPriceType, setDiscountPrice, couponDiscountPriceRef) => {
  const discountPriceToInt = Number(discountPrice)

  if (payload === '0') {
    setPriceType(payload)
  } else if (payload === '1') {
    setPriceType(payload)

    if (discountPriceToInt > 99) {
      cusToast('할인 비율을 다시 입력해주세요.', 1500, 'top')
      setDiscountPrice('')
      couponDiscountPriceRef.current.focus()
    }
  } else {
    return false
  }
}

export default CurrencyRateConversion
