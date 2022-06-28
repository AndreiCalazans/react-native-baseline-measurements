/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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

function HomeScreen() {
  useEffect(() => {
    performance.measure('home', 'app_file');
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();
const StackTwo = createStackNavigator();
const StackThree = createStackNavigator();
const StackFour = createStackNavigator();

const Four = () => (
  <StackFour.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
  </StackFour.Navigator>
);

const Three = () => (
  <StackThree.Navigator headerMode="none">
    <Stack.Screen name="Home" component={Four} />
  </StackThree.Navigator>
);

const Two = () => (
  <StackTwo.Navigator headerMode="none">
    <Stack.Screen name="Home" component={Three} />
  </StackTwo.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={Two} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
