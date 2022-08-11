import cusToast from '../components/CusToast'

// curVal이 val 보다 크면 false
export const isHigherException = (curVal, val) => (fn) => {
  if (curVal > val) {
    cusToast('다운로드 유효기간 시작일이\n마지막 날짜보다 클 수 없습니다.')
  } else {
    fn(curVal)
  }
}

// curVal이 val 보다 작으면 false
export const isLowerException = (curVal, val) => (fn) => {
  if (curVal < val) {
    cusToast('다운로드 유효기간 마지막 날짜가\n시작 날짜보다 작을 수 없습니다.')
  } else {
    fn(curVal)
  }
}
