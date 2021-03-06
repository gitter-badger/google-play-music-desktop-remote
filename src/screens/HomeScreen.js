import React, { Component, PropTypes } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react/native'
import { getTheme } from 'react-native-material-kit'
// import Zeroconf from 'react-native-zeroconf'
import TrackCard from '../components/TrackCard'
import ControlBar from '../components/ControlBar'
import ProgressSlider from '../components/ProgressSlider'
import Toolbar from '../components/Toolbar'
import colors from '../theme/colors'

const theme = getTheme()

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    trackStore: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  componentDidMount () {
    const { webSocketStore } = this.props
    webSocketStore.connect()
    // this.zeroconf = new Zeroconf()
    // this.zeroconf.scan(type = 'http', protocol = 'tcp', domain = 'local.')
    // this.zeroconf.scan('GPMDP')
    // this.zeroconf.on('start', () => console.log('start.'))
    // this.zeroconf.on('found', () => console.log('found.'))
    // this.zeroconf.on('resolved', () => console.log('resolved.'))
    // this.zeroconf.on('error', () => console.log('error.'))
  }

  _handlePlayPress = () => {
    this.props.webSocketStore.sendPlay()
  }

  _handlePrevPress = () => {
    this.props.webSocketStore.sendPrev()
    this.props.trackStore.stop()
  }

  _handleNextPress = () => {
    this.props.webSocketStore.sendNext()
    this.props.trackStore.stop()
  }

  _handleShufflePress = () => {
    this.props.webSocketStore.sendToggleShuffle()
    this.props.webSocketStore.sendGetShuffle()
  }

  _handleRepeatPress = () => {
    this.props.webSocketStore.sendToggleRepeat()
    this.props.webSocketStore.sendGetRepeat()
  }

  _handleProgressBarTouch = (value) => {
    this.props.webSocketStore.sendSetTime(value)
  }

  render () {
    const { title, artist, album, albumArt, isPlaying,
      isStopped, currentTime, totalTime } = this.props.trackStore
    return (
      <View style={styles.container}>
        <StatusBar animated backgroundColor={colors.ORANGE_DARK} />
        <Toolbar title={'Home'} />
        <View style={styles.content}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TrackCard
              title={title}
              artist={artist}
              album={album}
              albumArt={albumArt}
            />
          </View>
          <View style={[theme.cardStyle, styles.controlBar]}>
            <ControlBar
              isPlaying={isPlaying}
              isStopped={isStopped}
              onPlayPress={this._handlePlayPress}
              onPrevPress={this._handlePrevPress}
              onNextPress={this._handleNextPress}
              onShufflePress={this._handleShufflePress}
              onRepeatPress={this._handleRepeatPress}
            />
          </View>
          <ProgressSlider
            ref={'progressSlider'}
            min={0}
            max={totalTime}
            value={currentTime}
            onValueChange={this._handleProgressBarTouch}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  content: {
    flex: 1,
    backgroundColor: colors.GREY_LIGHTER
  },
  controlBar: {
    flex: 0,
    height: 100,
    elevation: 4
  }
})
