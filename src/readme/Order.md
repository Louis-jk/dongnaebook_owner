# 주문내역 관련

### 주문 접수 시 보낼 값

- 주문번호(ID)
- 점주 ID
- 점주 CODE(매장)
- 예상 배달시간 or 예상 포장시간(방문포장일 경우)
- 주문 접수확인 (그러면 이 주문건은 접수완료로 DB에서 상태 변화 필요)

---

### 전송시 key, value 형식

<!-- <details markdown="1">
<summary>전송예시보기</summary> -->

```json
{
  "od_id": "2021061809161281", // 주문번호 ID
  "jumju_id": "test1", // 점주 ID
  "jumju_code": "P20201200002", // 점주 CODE(매장)
  "delivery_time": "30", // 예상 배달시간 or 예상 포장시간(방문포장일 경우)
  "check_order": true // 주문 접수확인 (그러면 이 주문건은 접수완료로 DB에서 상태 변화 필요)
}
```

<!-- <details> -->

---

### 배달처리 시 보낼 값 (접수완료 -> 배달)

- 주문번호(ID)
- 점주 ID
- 점주 CODE(매장)
- 배달시작 (그러면 이 주문건은 접수완료에서 배달중으로 DB에서 상태 변화 필요)

<!-- <details markdown="1">
<summary>전송예시보기</summary> -->

```json
{
  "od_id": "2021061809161281", // 주문번호 ID
  "jumju_id": "test1", // 점주 ID
  "jumju_code": "P20201200002", // 점주 CODE(매장)
  "send_order": true // 배달시작 (그러면 이 주문건은 접수완료에서 배달중으로 DB에서 상태 변화 필요)
}
```

<!-- <details> -->
