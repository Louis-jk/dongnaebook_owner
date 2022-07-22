# 메뉴등록

### 필요한 메뉴 카테고리(필드)값

- 밥류, 세트류, 면류, 튀김류 등

---

### 전송시 key, value 형식

<!-- <details markdown="1">
<summary>전송예시보기</summary> -->

```json
{
  "jumju_id": "test1", // 점주 ID
  "jumju_code": "P20201200002", // 점주 CODE(매장)
  "menuImage": {
    "uri": "file:///storage/emulated/0/Android/data/com.dmonster.dongnaebookowner/files/Pictures/d21e619a-9981-4bb3-a3f5-51c037465bff.jpg",
    "type": "image/jpeg",
    "name": "/d21e619a-9981-4bb3-a3f5-51c037465bff.jpg"
  }, // 메뉴 이미지
  "category": "30", // 카테고리 ca_code명
  "menuName": "비빔밥", // 메뉴명
  "checkMain": true, // 대표메뉴 유무 (true : 대표메뉴 / false: 일반메뉴)
  "menuInfo": "전주 비빔밥", // 메뉴 기본설명
  "menuPrice": "6000", // 메뉴 판매가격
  "menuDescription": "전주에서 배워서 전통의 맛 그대로 드셔보시면 아실꺼라 생각해요", // 메뉴 상세설명
  "menuVisible": true, // 메뉴 판매가능 여부(노출, 비노출) : true(노출)
  "menuOption": [
    // 메뉴 기본옵션
    {
      "name": "맛선택",
      "select": [
        {
          "value": "매운맛",
          "price": "1000"
        },
        {
          "value": "순한맛",
          "price": "0"
        },
        {
          "value": "고소한맛",
          "price": "1000"
        }
      ]
    },
    {
      "name": "사이즈",
      "select": [
        {
          "value": "특대",
          "price": "2000"
        },
        {
          "value": "대",
          "price": "1000"
        },
        {
          "value": "보통",
          "price": "0"
        },
        {
          "value": "소",
          "price": "-1000"
        },
        {
          "value": "특소",
          "price": "-2000"
        }
      ]
    }
  ],
  "menuAddOption": [
    // 메뉴 추가옵션
    {
      "name": "음료",
      "select": [
        {
          "value": "콜라 1.5L",
          "price": "1500"
        },
        {
          "value": "사이다 1.5L",
          "price": "1500"
        },
        {
          "value": "콜라 500ml",
          "price": "800"
        },
        {
          "value": "사이다 500ml",
          "price": "800"
        }
      ]
    }
  ]
}
```

<!-- <details> -->
