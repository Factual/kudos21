import _ from 'lodash'
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import BottomScrollListener from 'react-bottom-scroll-listener'
import AppStore from '../stores/AppStore'
import TabBar from '../components/TabBar'
import Kudo from './Kudo'

injectTapEventPlugin()

@observer
export class KudosList extends React.Component {
  loadMoreKudos = () => {
    if (AppStore.kudosStore.canLoadMore && !AppStore.kudosStore.isFetchingKudos) {
      AppStore.kudosStore.fetchKudos()
    }
  }

  render() {
    return (
      <div className="kudos-list__container">
        <TabBar />
        <List
          user={AppStore.user}
          kudos={AppStore.kudosStore.kudos}
          isFetchingKudos={AppStore.kudosStore.isFetchingKudos}
        />
        <div className="kudos-list__fetching-container">
          {AppStore.kudosStore.isFetchingKudos ? (
            <Spinner />
          ) : AppStore.kudosStore.canLoadMore ? (
            <LoadMore onClick={this.loadMoreKudos} />
          ) : null}
        </div>
        <BottomScrollListener debounce={0} offset={300} onBottom={this.loadMoreKudos} />
      </div>
    )
  }
}

@observer
export class List extends React.Component {
  render() {
    return (
      <div className="kudos-list">
        {this.props.kudos.length === 0 && !this.props.isFetchingKudos
          ? 'No kudos'
          : this.props.kudos.map(kudo => (
              <Kudo
                id={kudo.id}
                userId={this.props.user.id}
                key={kudo.id}
                kudo={kudo}
                likeKudo={id => () => AppStore.kudosStore.likeKudo(id)}
                unlikeKudo={id => () => AppStore.kudosStore.unlikeKudo(id, AppStore.user.id)}
                updateKudo={message => AppStore.kudosStore.editKudo(kudo.id, message)}
                toggleSuperKudoMode={AppStore.easterEggStore.toggleSuperKudoMode}
                superKudoMode={AppStore.easterEggStore.superKudoMode}
                flashKudo={AppStore.easterEggStore.flashKudo}
                showMeta
              />
            ))}
      </div>
    )
  }
}

const LoadMore = ({ onClick }) => <a onClick={onClick}>Load more...</a>

const Spinner = () => <i className="fas fa-spin fa-spinner fa-5x" aria-hidden="true" />

export default KudosList
