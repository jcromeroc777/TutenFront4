import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
import { Divider } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

import Login from './app/components/Login';
import Dashboard from "./app/components/Dashboard";

export default function App() {
  const toastRef = useRef();
  const [tokenLogin, setTokenLogin] = useState(null);

  return (
    <NativeRouter>
      <ScrollView>
        <View style={styles.container}>
          <Route exact path="/" component={() => <Login toastRef={toastRef} setToken={setTokenLogin} />} />
          <Route path="/dashboard" component={() => <Dashboard toastRef={toastRef} token={tokenLogin} />} />
        </View>
        <Divider style={styles.divider}/>
        <Toast
            ref={toastRef}
            position="center"
            opacity={0.9}
            useNativeDriver={true}
        />
      </ScrollView>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  divider: {
       backgroundColor: "#00a680",
       margin: 40
  },
});
