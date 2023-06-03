import { NameSpace } from './const'

const { NAME, STATUS_ID, RESPONSIBLE_USER_ID, CREATED_AT, PRICE } = NameSpace

export default [
  {
    title: 'Название',
    dataIndex: NAME,
    key: NAME,
    width: '40%'
  },
  {
    title: 'Статус',
    dataIndex: STATUS_ID,
    key: STATUS_ID,
    width: '15%'
  },
  {
    title: 'Ответственный',
    dataIndex: RESPONSIBLE_USER_ID,
    key: RESPONSIBLE_USER_ID,
    width: '15%'
  },
  {
    title: 'Дата создания',
    dataIndex: CREATED_AT,
    key: CREATED_AT,
    width: '15%',
    align: 'center'
  },
  {
    title: 'Бюджет',
    dataIndex: PRICE,
    key: PRICE,
    width: '15%',
    align: 'center'
  }
]
