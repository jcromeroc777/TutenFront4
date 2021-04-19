import React, { useState, useEffect } from "react";
import { StyleSheet, View, LogBox } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { useHistory  } from "react-router-native";
import { useForm } from "react-hook-form";
import Loading from './Loading';

import API from './../api/api';

import { patternEmail } from './../utils/valdiations';

LogBox.ignoreAllLogs();

export default function Login(props) {
    const { toastRef } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [request, setRequest] = useState(true);

    const { register, setValue, handleSubmit, errors } = useForm();
    
    let isMounted = true;
    let history = useHistory();

    const onSubmit = (data) => {
        setLoading(true);

        if (request) {
        
            const headers = {
                'Accept': 'application/json',
                'password': data.password,
                'app': 'APP_BCK'
            }
        
            API.put(`/TutenREST/rest/user/testapis%40tuten.cl?email=${data.email}`, null, {
            headers: headers
            })
            .then((response) => {
            if (!isMounted) return;
                props.setToken(response.data.sessionTokenBck);
                setLoading(false);
                setToken(response.data.sessionTokenBck);
                history.push('/dashboard');
            }).catch((error) => {
            if (!isMounted) return;
                setLoading(false);
                toastRef.current.show("Credenciales inválidas");
            });
        }

        setRequest(false);
    };

    useEffect(() => {
        isMounted = true;

        if (isMounted) {
            register(
                { name: "email"}, 
                { required: { value: true, message: 'Correo vacío'}, 
                pattern: { value: patternEmail, message: 'Correo inválido'} });
            register(
                { name: "password"}, 
                { required: { value: true, message: 'Contraseña vacía'} });
        } else {
            return () => { isMounted = false; };
        }
    }, [register]);

    return (
        <View style={styles.formContainer}>
            <Icon
                type="material-community"
                name="account-circle"
                size={100}
            />
            <Input
                placeholder="Correo Electrónico"
                placeholderTextColor={errors.email ? "red" : "#c1c1c1"}
                containerStyle={styles.inputForm}
                inputContainerStyle={errors.email ? styles.inputShowError : null}
                onChange={(e) => setValue("email", e.nativeEvent.text, true)}
                rightIcon={
                <Icon
                    type="material-community"
                    name="at"
                    iconStyle={errors.email ? styles.iconRightError : styles.iconRight}
                />
                }
                errorStyle={{ color: "red" }}
                errorMessage={errors.email ? errors.email.message : ""}
            />
            <Input
                placeholder="Contraseña"
                placeholderTextColor={errors.password ? "red" : "#c1c1c1"}
                containerStyle={styles.inputForm}
                inputContainerStyle={errors.password ? styles.inputShowError : null}
                password={true}
                secureTextEntry={!showPassword ? true : false}
                onChange={(e) => (setValue("password", e.nativeEvent.text, true))}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={
                        errors.password ? styles.iconRightError : styles.iconRight
                        }
                        onPress={() => { setShowPassword(!showPassword); }}
                    />
                }
                errorStyle={{ color: "red" }}
                errorMessage={errors.password ? errors.password.message : ""}
            />
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={handleSubmit(onSubmit)}
            />
            <Loading
                isVisible={loading}
                text="Inciando Sesión"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 150,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    inputShowError: {
        borderBottomColor: 'red',
    },
    inputError: {
        textDecorationColor: "red"
    },
    iconRight: {
        color: "#c1c1c1"
    },
    iconRightError: {
        color: "red"
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
});