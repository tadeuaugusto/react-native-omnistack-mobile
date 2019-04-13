import React, { Component } from 'react';
import { View, Text } from 'react-native';
import api from '../../services/api';

import styles from './styles';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

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

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('ImagePicker error');
      } else if (upload.didCancel) {
        ('Cancelled by user');
      } else {
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        })

        api.post(`boxes/${thist.state.box._id}/files`, data);
      }
    });
  }

  openFile = (file) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;

      // download the file
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);
    } catch (err) {
      console.log('File is not supported')
    }
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.openFile(item)}
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

          <TouchableOpacity style={ styles.fab } onPress={ this.handleUpload }>
            <Icon name='cloud-upload' size={24} color='#FFF' />
          </TouchableOpacity>
      </View>
    );
  }
}
