# 정산내역

### 필요한 속성(필드)값

- 해당 월(month)
- 정산 금액(price)
- 정산완료 유무(isCalculated) -> data type : boolean 또는 string

##### 추가 사항

- 월별조회
- 기간조회

<details markdown="1">
<summary>예시보기</summary>

```json
[
  {
    "month": "3", // 해당 월
    "price": "5,795,000", // 정산 금액
    "isCalculated": false // 정산완료 유무(정산중)
  },
  {
    "month": "2", // 해당 월
    "price": "1,995,000", // 정산 금액
    "isCalculated": true // 정산완료 유무(정산완료)
  },
  {
    "month": "1", // 해당 월
    "price": "2,775,000", // 정산 금액
    "isCalculated": true // 정산완료 유무(정산완료)
  }
]
```

<details>
