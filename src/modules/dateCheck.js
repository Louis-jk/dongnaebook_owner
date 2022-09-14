import cusToast from '../components/CusToast'

// curVal이 val 보다 크면 false
export const isHigherException = (curVal, val, type) => (fn) => {
  if (curVal > val) {
    if (type === 'coupon') {
      cusToast('다운로드 유효기간 시작일이\n마지막 날짜보다 클 수 없습니다.')
    }
    if (type === 'calculate') {
      cusToast('시작일자가 종료일자보다\n클 수 없습니다.')
    }
  } else {
    fn(curVal)
  }
}

// curVal이 val 보다 작으면 false
export const isLowerException = (curVal, val, type) => (fn) => {
  if (curVal < val) {
    if (type === 'coupon') {
      cusToast('다운로드 유효기간 마지막 날짜가\n시작 날짜보다 작을 수 없습니다.')
    }
    if (type === 'calculate') {
      cusToast('종료일자가 시작일자보다\n작을 수 없습니다.')
    }
  } else {
    fn(curVal)
  }
}
