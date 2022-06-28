/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import performance, {PerformanceObserver} from 'react-native-performance';

performance.mark('app_file');

const measureObserver = new PerformanceObserver((list, _) => {
  console.log('**measure**');
  list.getEntries().forEach(entry => {
    console.log(`marker: ${entry.name} took ${entry.duration}ms`);
  });
});

measureObserver.observe({type: 'measure', buffered: true});

new PerformanceObserver((list, _) => {
  if (list.getEntries().find(entry => entry.name === 'runJsBundleEnd')) {
    // nativeLuanch - how long it takes to initialize the native context
    // this includes native module initialization + the full React context.
    performance.measure('nativeLaunch', 'nativeLaunchStart', 'nativeLaunchEnd');

    // runJsBundle - how long it takes to parse the JS bundle.
    performance.measure('runJsBundle', 'runJsBundleStart', 'runJsBundleEnd');
  }
}).observe({type: 'react-native-mark', buffered: true});

function HomeScreen({navigation}) {
  useEffect(() => {
    performance.measure('home', 'app_file');
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="detail"
        onPress={() => {
          performance.mark('home_navigate');
          navigation.navigate('Detail');
        }}
      />
    </View>
  );
}

function Detail() {
  useEffect(() => {
    performance.measure('detail', 'home_navigate');
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Detail Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const MultipleScreens = Array.from({length: 100}).map((_, idx) => (
  <Stack.Screen
    key={`Screen_${idx + 1}`}
    options={{headerShown: false}}
    name={`Screen_${idx + 1}`}
    component={Detail}
  />
));

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          options={{headerShown: false}}
          name="Detail"
          component={Detail}
        />
        {MultipleScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
