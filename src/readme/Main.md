# 메인화면

### 필요한 속성(필드)값

- 상호명(store)
- 주문날짜(orderTime)
- 주문시각(orderTime)
- 휴대전화번호(mobile)
- 주문메뉴(orderMenu)
  - 메뉴명(title) : 갯수포함 또는 갯수 추가 필드
  - 주문개수(메뉴명에 포함 시키지 않을 시 개수)
  - 옵션(option)
- 주문방법(배달, 포장 등)(orderMethod)
- 배달주소(address)
  - 배달주소01(도로명)(a01)
  - 배달주소02(지번)(a02)
- 선결제유무(payment) : boolean 또는 다른방식
- 총 결제금액(totalPrice)
- 총 주문금액(orderPrice)
- 배달팁(deliveryTip)
- 포인트(point)
- 쿠폰할인(coupon)
- 결제방법(만나서 결제 등)(payMethod)
- 요청사항(comment)
  - 사장님께(ceo)
  - 배달기사님께(rider)

<details markdown="1">
<summary>예시보기</summary>

```json
{
  "order": "2020년 8월 13일 17:45", // 주문날짜
  "orderTime": "13:22", // 주문시각
  "mobile": "010-1234-5678", // 휴대전화번호
  "orderMethod": "delivery", // 주문방법(배달, 포장 등)
  "store": "땅땅치킨 봉래점", // 상호명
  "orderMenu": [
    // 주문메뉴
    {
      "title": "양념치킨 1개", // 메뉴명
      "option": "기본" // 옵션
    },
    {
      "title": "간장치킨 2개",
      "option": "토핑 : 갈릭소스(2,000원)"
    }
  ],
  "payment": false, // 선결제유무
  "totalPrice": "10,900", // 총 결제금액
  "orderPrice": "5,000", // 총 주문금액
  "deliveryTip": "3,000", // 배달팁
  "point": "0", // 포인트
  "coupon": "0", // 쿠폰
  "payMethod": "만나서 카드결제", // 결제방법
  "address": {
    // 배달주소
    "a01": "부산시 금정구 금정로 225 5층", // 배달주소 도로명
    "a02": "부산시 금정구 구서동 445-21 5층" // 배달주소 지번
  },
  "comment": {
    // 요청사항
    "ceo": "소스를 좀 많이 넣어 주세요", // 사장님께
    "rider": "조심히 와주세요" // 배달기사님께
  }
}
```

<details>
