// Module Pattern
import Api from '../../Api'
import Steps from '../order/steps'

export const OrderCategoryRequest = {

  index: 0,
  items: [],

  selectType: function (memberId, memberCode, index) {
    this.index = index
    const type = Steps[index]
    this.getOrderHandler(memberId, memberCode, type)
  },

  getOrderHandler: function (memberId, memberCode, index) {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: memberId,
      jumju_code: memberCode,
      od_process_status: Steps[index]
    }

    console.log('param?', param)

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      this.items = arrItems
      return arrItems
    })
  },

  getItems: function () {
    return this.items
  },

  getIndex: function () {
    return this.index
  }

}
