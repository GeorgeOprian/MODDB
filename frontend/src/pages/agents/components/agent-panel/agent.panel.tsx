import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { FormStyle } from "./agent.panel.style";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { createAgentDB, editAgentDB } from "../../agents.page.requests";

type ApartmentPanelType = {
    editAgent?: AgentFields
}

type AgentFields = {
    idAgent?: number,
    nume: string,
    prenume: string,
    telefon: string,
    email: string,
    dataAngajare: Date | null | Dayjs,
    salariu: number | null,
    comision: number | null,
}

const AgentPanel = ({
    editAgent
}: ApartmentPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [agentFields, setAgentField] = useState<AgentFields>({
        nume: "",
        prenume: "",
        telefon: "",
        email: "",
        dataAngajare: null,
        salariu: null,
        comision: null,
    })

    const changeState = (key: any, value: any) => {
        setAgentField({
            ...agentFields,
            [key]: value
        })
    }


    useEffect(
        () => {
            if(!editAgent) return;
            console.log(dayjs(editAgent.dataAngajare as any))
           
            setAgentField(() => ({
                nume: editAgent.nume,
                prenume: editAgent.prenume,
                comision: editAgent.comision,
                dataAngajare: dayjs(editAgent.dataAngajare as any),
                email: editAgent.email,
                salariu: editAgent.salariu,
                telefon: editAgent.telefon
            }));
        },
        [editAgent]
    )

    const editAgentAction = async () => {

        const body = {
            nume: agentFields.nume,
            prenume: agentFields.prenume,
            comision: agentFields.comision,
            dataAngajare: agentFields.dataAngajare,
            email: agentFields.email,
            salariu: agentFields.salariu,
            telefon: agentFields.telefon
        }

        try {
            await editAgentDB(body, (editAgent?.idAgent as any));
            panelState.closePanel();
            panelState.setRefreshData({
                refreshAgents: true
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
            nume: agentFields.nume,
            prenume: agentFields.prenume,
            comision: agentFields.comision,
            dataAngajare: agentFields.dataAngajare,
            email: agentFields.email,
            salariu: agentFields.salariu,
            telefon: agentFields.telefon
        }

        try {
            await  createAgentDB(body);
            panelState.closePanel();
            panelState.setRefreshData({
                refreshAgents: true
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
                                value={agentFields.nume}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Prenume"
                                onChange={(e) => changeState("prenume", e.currentTarget.value) } 
                                value={agentFields.prenume}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Telefon"
                                onChange={(e) => changeState("telefon", e.currentTarget.value) } 
                                value={agentFields.telefon}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Email"
                                onChange={(e) => changeState("email", e.currentTarget.value) } 
                                value={agentFields.email}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data angajare"
                                    onChange={(e) => changeState("dataAngajare", e) } 
                                    value={agentFields.dataAngajare}
                                    format="DD.MM.YYYY"
                                    disableFuture
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Salariu"
                                onChange={(e) => changeState("salariu", e.currentTarget.value) } 
                                value={agentFields.salariu}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Comision"
                                onChange={(e) => changeState("comision", e.currentTarget.value) } 
                                value={agentFields.comision}
                                type="number"
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editAgent)
                                    editAgentAction()  
                                else 
                                    createAgentAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editAgent ?
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

export default AgentPanel;