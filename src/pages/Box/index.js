import React, { Component } from 'react';
import { View, Text } from 'react-native';
import api from '../../services/api';

import styles from './styles';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

export default class Box extends Component {

  state = {
    box: {}
  };

  async componentDidMount() {
    // this.subscribeToNewFiles();

    const box = await AsyncStorage.getItem('@RocketBox:box');
    const response = await api.get(`boxes/${box}`);

    this.setState({ box: response.data });
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {}}
      style={ styles.file }
    >
      <View style={ styles.fileInfo }>
        <Icon name='insert-drive-file' size={24} color='#A5CFFF' />
        <Text style={ styles.fileTitle }>{ item.title }</Text>
      </View>

      <Text style={styles.fileDate}>
        há {distanceInWords(item.createdAt, new Date(), {
          locale: pt
        })}
      </Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View styles={ styles.container }>
        <Text style={ styles.boxTitle }>{ this.state.box.title }</Text>
        <FlatList
          style={ styles.list }
          data={ this.state.box.files }
          keyExtractor={ file => file._id }
          ItemSeparatorComponent={ () => <View style={styles.separator} />}
          renderItem={ this.renderItem }

          />
      </View>
    );
  }
}
