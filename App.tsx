/**

* Sample React Native App

* https://github.com/facebook/react-native

*

* @format

*/

import React, {useEffect, useRef, useState} from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import ImageCropPicker from 'react-native-image-crop-picker';

import {Camera, useCameraDevices} from 'react-native-vision-camera';

import {PERMISSIONS, request} from 'react-native-permissions';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [files, setFiles] = useState([]);
  const [flash, setFlash] = useState(false);
  const [enableCamera, setEnableCamera] = useState(false);

  useEffect(() => {
    initialRequestPermissions();
  }, []);
  if (device != null && enableCamera)
    return (
      <>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />

        <Button
          onPress={async () => {
            const photo = await camera.current?.takePhoto({
              flash: flash ? 'on' : 'off',
            });

            const result = await ImageCropPicker.openCropper({
              mediaType: 'photo',

              path: ('file://' + photo?.path) as string,

              width: 1000,

              height: 1000,
            });

            setFiles([...files, result]);

            setEnableCamera(false);
          }}
          title="Take Photo"
        />

        <Button
          onPress={() => setFlash(!flash)}
          title={flash ? 'Disable Flash' : 'Enable Flash'}
        />
      </>
    );

  const initialRequestPermissions = async () => {
    await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    await request(PERMISSIONS.ANDROID.CAMERA);
    await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
    await request(PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Button
          onPress={() => {
            ImageCropPicker.openPicker({
              // ...imagePickerOptions,

              compressImageMaxWidth: 1000,

              compressImageMaxHeight: 1000,

              multiple: true,

              mediaType: 'photo',
            }).then(async images => {
              const result = [];

              for (const image of images) {
                result.push(
                  await ImageCropPicker.openCropper({
                    mediaType: 'photo',

                    path: image.path,

                    width: 1000,

                    height: 1000,
                  }),
                );
              }

              setFiles([...files, ...result]);

              return result;
            });
          }}
          title="Pick Image"
        />

        <Button
          onPress={() => {
            ImageCropPicker.openPicker({
              compressImageMaxWidth: 1000,
              compressImageMaxHeight: 1000,
              mediaType: 'video',
              multiple: true,
            }).then(async images => {
              setFiles([...files, ...images]);

              return images;
            });
          }}
          title="Pick Video"
        />

        <Button
          onPress={() => {
            setEnableCamera(true);
          }}
          title="Capture Image"
        />

        <Button
          onPress={() => {
            ImageCropPicker.openCamera({
              width: 300,
              height: 400,
              mediaType: 'video',
            }).then(image => {
              setFiles([...files, image]);
            });
          }}
          title="Capture Video"
        />

        <Text style={{margin: 20}}>Total Files: {files.length}</Text>

        {files.map(item => {
          return <Text>{item?.path}</Text>;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,

//     paddingHorizontal: 24,
//   },

//   sectionTitle: {
//     fontSize: 24,

//     fontWeight: '600',
//   },

//   sectionDescription: {
//     marginTop: 8,

//     fontSize: 18,

//     fontWeight: '400',
//   },

//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
