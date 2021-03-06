import dayjs from 'dayjs'
import { has, keys } from 'lodash'
import { computed, observable } from 'mobx'
import { User } from '.'

export class Kudo {
  id = ''
  @observable body = ''
  receivers = []
  giver = ''
  givenAt = ''
  @observable likes = []
  @observable colorClass = ''

  constructor(kudo) {
    this.validateKudo(kudo)

    this.id = kudo.id
    this.body = kudo.body
    this.receivers = kudo.receivers.map(receiver => new User(receiver))
    this.giver = new User(kudo.giver)
    this.givenAt = kudo.given_at
    this.likes = kudo.likes
    this.colorClass = kudo.colorClass
  }

  @computed
  get numLikes() {
    return this.likes.length
  }

  @computed
  get timestamp() {
    const ts = dayjs(this.givenAt)
    return `At ${ts.format('h:mm a')} on ${ts.format('MMM D, YYYY')}`
  }

  validateKudo(kudo) {
    const kudosProps = ['id', 'body', 'giver', 'given_at', 'likes']
    if (!kudosProps.every(prop => has(kudo, prop))) {
      throw new Error(`Invalid kudo: ${kudo}`)
    }
  }
}

export default Kudo
