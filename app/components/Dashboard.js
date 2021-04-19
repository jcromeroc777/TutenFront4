import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Header, Input, Button } from 'react-native-elements';
import { useHistory  } from "react-router-native";
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import Loading from './Loading';
import API from './../api/api';

export default function Dashboard(props) {
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState(true);
    const [data, setData] = useState(null);
    const [dataCopy, setDataCopy] = useState(null);

    const [filterValue, setFilterValue] = useState("");
    const [operator, setOperator] = useState("");
    const [value, setValue] = useState("");

    const [showFilter, setShowFilter] = useState(true);

    let history = useHistory();

    useEffect(() => {

        if (request) {
            const headers = {
                'Accept': 'application/json',
                'adminemail': 'testapis@tuten.cl',
                'token': props.token,
                'app': 'APP_BCK'
            }

            API.get(`/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true&email=contacto@tuten.cl`, {
            headers: headers
            })
            .then((response) => {
                setData(response.data);
                setDataCopy(response.data);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                toastRef.current.show("Error al cargar datos, vuelva a loguearse");
            });
        }

        return () => {
            setRequest(false);
        }
    });

    const calculateDate = (timestamp) => {
        var date = new Date(timestamp);
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    };

    const clean = () => {
        setFilterValue("");
        setOperator("");
        setValue("");
        setShowFilter(true);
        setData(dataCopy);
    };

    const filtering = () => {
        setData(dataCopy);
        let dataFilter = [];
        
        if(filterValue === "bookingId") {
            if(operator === "=="){
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId == value);
            } else if (operator === ">=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId >= value);
            } else if (operator === "<=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingId <= value);
            }
        } else if(filterValue === "bookingPrice") {
            if(operator === "=="){
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice == value);
            } else if (operator === ">=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice >= value);
            } else if (operator === "<=") {
                // eslint-disable-next-line
                dataFilter = data.filter(booking => booking.bookingPrice <= value);
            }
        }
        setData(dataFilter);
        setShowFilter(false);
    };

    return(
        <View style={styles.formContainer}>
            <Header
                placement="left"
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'Reservaciones', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff', onPress: () => { history.push('/'); } }}
            />
            <View style={styles.filters}>
                <Picker
                    style={styles.pickers}
                    selectedValue={filterValue}
                    onValueChange={(itemValue, itemIndex) =>
                        setFilterValue(itemValue)
                    }
                    mode="dropdown"
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Id" value="bookingId" />
                    <Picker.Item label="Precio" value="bookingPrice" />
                </Picker>
                <Picker
                    style={styles.pickers}
                    selectedValue={operator}
                    onValueChange={(itemValue, itemIndex) =>
                        setOperator(itemValue)
                    }
                    mode="dropdown"
                >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="=" value="==" />
                    <Picker.Item label=">=" value=">=" />
                    <Picker.Item label="<=" value="<=" />
                </Picker>
                <Input
                    placeholder="Valor"
                    containerStyle={styles.inputForm}
                    value={value}
                    onChange={(e) => setValue(e.nativeEvent.text)}
                />
            </View>
            <View style={styles.buttons}>
                { showFilter ?
                <Button
                    title="Filtrar"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={filtering}
                />
                :
                    null
                }
                <Button
                    title="Limpiar"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={clean}
                />
            </View>
            { !loading && data ?
            <DataTable style={styles.table}>
                <DataTable.Header>
                <DataTable.Title>BookingId</DataTable.Title>
                <DataTable.Title>Cliente</DataTable.Title>
                <DataTable.Title>Fecha</DataTable.Title>
                <DataTable.Title>Dirección</DataTable.Title>
                <DataTable.Title>Precio</DataTable.Title>
                </DataTable.Header>
                {data.map((row) => (
                    <DataTable.Row key={row.bookingId}>
                        <DataTable.Cell>{row.bookingId}</DataTable.Cell>
                        <DataTable.Cell>{`${row.tutenUserClient.firstName} ${row.tutenUserClient.lastName}`}</DataTable.Cell>
                        <DataTable.Cell>{calculateDate(row.bookingTime)}</DataTable.Cell>
                        <DataTable.Cell>{row.locationId.streetAddress}</DataTable.Cell>
                        <DataTable.Cell>{row.bookingPrice}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
            :
            null
            }
            <Loading
                isVisible={loading}
                text="Cargando Datos"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 35,
    },
    table: {
        marginTop: 50,
    },
    filters: {
        flex: 1,
        flexDirection: 'row',
        padding: 0, 
        marginTop: 30
    },
    pickers: {
        height:30, 
        width:110
    },
    inputForm: {
        width: "40%"
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        padding: 0, 
        marginTop: 10 
    },
    btnContainer: {
        marginTop: 0,
        marginRight: 10,
        width: "20%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
});