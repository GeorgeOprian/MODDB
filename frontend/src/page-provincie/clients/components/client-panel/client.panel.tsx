import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { FormStyle } from "./client.panel.style";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { createClientDB, editClientDB } from "../../clients.page.requests";

type ClientPanelType = {
    editClient?: ClientFields
}

type ClientFields = {
    idChirias?: number,
    nume: string,
    prenume: string,
    telefon: string,
    email: string,
    dataNastere: Date | null | Dayjs,
    sex: string,
    stareaCivila: string,
}

const ClientPanel = ({
    editClient
}: ClientPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [clientFields, setClientField] = useState<ClientFields>({
        nume: "",
        prenume: "",
        telefon: "",
        email: "",
        dataNastere: null,
        sex: "",
        stareaCivila: "",
    })

    const changeState = (key: any, value: any) => {
        setClientField({
            ...clientFields,
            [key]: value
        })
    }


    useEffect(
        () => {
            if(!editClient) return;
           
            setClientField(() => ({
                nume: editClient.nume,
                prenume: editClient.prenume,
                dataNastere: dayjs(editClient.dataNastere as any),
                email: editClient.email,
                stareaCivila: editClient.stareaCivila,
                sex: editClient.sex,
                telefon: editClient.telefon
            }));
        },
        [editClient]
    )

    const editAgentAction = async () => {

        const body = {
            nume: clientFields.nume,
            prenume: clientFields.prenume,
            sex: clientFields.sex,
            dataNastere: clientFields.dataNastere,
            email: clientFields.email,
            stareaCivila: clientFields.stareaCivila,
            telefon: clientFields.telefon
        }

        try {
            await editClientDB(body, (editClient?.idChirias as any));
            panelState.closePanel();
            panelState.setRefreshData({
                refreshClients: true
            });
            toastState.setToast({
                open: true,
                message: "Actiune realizata cu succes"
            })
            
        } catch (error) {
            toastState.setToast({
                open: true,
                message: "Eroare"
            })
        }
    }

    const createAgentAction = async () => {

        const body = {
            nume: clientFields.nume,
            prenume: clientFields.prenume,
            sex: clientFields.sex,
            dataNastere: clientFields.dataNastere,
            email: clientFields.email,
            stareaCivila: clientFields.stareaCivila,
            telefon: clientFields.telefon
        }

        try {
            await  createClientDB(body);
            panelState.closePanel();
            panelState.setRefreshData({
                refreshClients: true
            });
            toastState.setToast({
                open: true,
                message: "Actiune realizata cu succes"
            })
            
        } catch (error) {
            toastState.setToast({
                open: true,
                message: "Eroare"
            })
        }
    }

    return (
        <div
            style={{
                padding: "2rem"
            }}
        >
            {
                isLoading ?
                    <CircularProgress />
                    :
                    <FormGroup>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                variant="outlined"
                                label="Nume"
                                onChange={(e) => changeState("nume", e.currentTarget.value) } 
                                value={clientFields.nume}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Prenume"
                                onChange={(e) => changeState("prenume", e.currentTarget.value) } 
                                value={clientFields.prenume}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Telefon"
                                onChange={(e) => changeState("telefon", e.currentTarget.value) } 
                                value={clientFields.telefon}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Email"
                                onChange={(e) => changeState("email", e.currentTarget.value) } 
                                value={clientFields.email}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data nastere"
                                    onChange={(e) => changeState("dataNastere", e) } 
                                    value={clientFields.dataNastere}
                                    format="DD.MM.YYYY"
                                    disableFuture
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Sex"
                                onChange={(e) => changeState("sex", e.currentTarget.value) } 
                                value={clientFields.sex}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Starea civila"
                                onChange={(e) => changeState("stareaCivila", e.currentTarget.value) } 
                                value={clientFields.stareaCivila}
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editClient)
                                    editAgentAction()  
                                else 
                                    createAgentAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editClient ?
                                    'Edit'
                                    :
                                    'Create'
                            }
                        </Button>
                    </FormGroup>

            }
        </div>
    )
}

export default ClientPanel;