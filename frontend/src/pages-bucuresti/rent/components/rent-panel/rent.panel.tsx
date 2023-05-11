import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { FormStyle } from "./rent.panel.style";
import { getApartments } from "../../../apartments/apartments.page.requests";
import { getClients } from "../../../clients/clients.page.requests";
import { createContractDB, createPayRentDB, editContractDB, getFreeApartments } from "../../rent.page.requests";
import { debug } from "console";
import { getAgents } from "../../../../pages/agents/agents.page.requests";

type RentPanelType = {
    editContract?: RentFields
}

type RentFields = {
    idContract?: number,
    dataInceput: Date | null | Dayjs,
    dataFinal: Date | null | Dayjs,
    ziuaScandenta: number | null ,
    pretInchiriere?: number | null ,
    incasari: number | null ,
    chirias?: any,
    apartament?: any,
    agent?: any,
    idChirias?: number,
    idApartament?: number,
    idAgent?: number
}

const RentPanel = ({
    editContract
}: RentPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [rentFields, setRentField] = useState<RentFields>({
        agent: null,
        apartament: null,
        chirias: null,
        dataFinal: null,
        dataInceput: null,
        incasari: 0,
        pretInchiriere: 0,
        ziuaScandenta: 0
    });
    const [apartments, setApartments] = useState<any[]>();
    const [allApartments, setAllApartments] = useState<any[]>();
    const [agents, setAgents] = useState<any[]>();
    const [clients, setClients] = useState<any[]>();

    const changeState = (key: any, value: any) => {
        setRentField({
            ...rentFields,
            [key]: value
        })
    }


    useEffect(
        () => {
            if(!editContract || !apartments || !agents || !clients) return;

            setRentField(() => ({
                agent: agents?.find(f => f.idAgent == editContract.idAgent),
                apartament: allApartments?.find(f => f.idApartament == editContract.idApartament),
                dataFinal: dayjs(editContract.dataFinal as any),
                incasari: editContract.incasari,
                pretInchiriere: editContract.pretInchiriere,
                ziuaScandenta: editContract.ziuaScandenta,
                dataInceput: dayjs(editContract.dataInceput as any),
                chirias: clients?.find(f => f.idChirias == editContract.idChirias)
            }));
        },
        [editContract, apartments, agents, clients]
    )

    useEffect(
        () => {
            setIsLoading(() => true)
            getFreeApartments()
            .then(
                data => setApartments(() => data)
            )
            .catch((e) => console.log(e))

            getApartments()
            .then(
                data => setAllApartments(() => data)
            )
            .catch((e) => console.log(e))

            getClients()
            .then(
                data => setClients(() => data)
            )
            .catch((e) => console.log(e))

            getAgents()
            .then(
                data => setAgents(() => data)
            )
            .catch((e) => console.log(e))
            .finally(() => setIsLoading(() => false))

        },
        []
    )

    const editAgentAction = async () => {

        const body = {
            ID_AGENT: rentFields.agent.idAgent,
            ID_APARTAMENT: rentFields.apartament.idApartament,
            dataFinal: dayjs(rentFields.dataFinal as any),
            incasari: rentFields.incasari,
            ziuaScandenta: rentFields.ziuaScandenta,
            dataInceput: dayjs(rentFields.dataInceput as any),
            ID_CHIRIAS: rentFields.chirias.idChirias,
            valoareEstimata: null
        }

        try {
            await editContractDB(body, (editContract?.idContract as any));
            panelState.closePanel();
            panelState.setRefreshData({
                refreshContracts: true
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
            ID_AGENT: rentFields.agent.idAgent,
            ID_APARTAMENT: rentFields.apartament.idApartament,
            dataFinal: rentFields.dataFinal,
            incasari: rentFields.apartament.pretInchiriere,
            pretInchiriere: rentFields.apartament.pretInchiriere,
            ziuaScandenta: rentFields.ziuaScandenta,
            dataInceput: rentFields.dataInceput,
            ID_CHIRIAS: rentFields.chirias.idChirias,
            valoareEstimata: null
        }

        try {
            let contract = await  createContractDB(body);
            
            const bodyRentPaid = {
                luna: new Date().getMonth() + 1,
                an: new Date().getFullYear(),
                suma: rentFields.apartament.pretInchiriere,
                dataEfectuarii: new Date(),
                nrZileIntarziere: 0,
                ID_CONTRACT: contract.idContract
            }

            await createPayRentDB(bodyRentPaid);

            panelState.closePanel();
            panelState.setRefreshData({
                refreshContracts: true
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

    const getApartmentFullAddress = (apartment: any) => {
        return `${apartment.AdresaBucuresti.strada}, ${apartment.AdresaBucuresti.numar}, ${apartment.AdresaBucuresti.bloc}, ${apartment.AdresaBucuresti.scara}, ${apartment.AdresaBucuresti.numarApartament}, ${apartment.AdresaBucuresti.LocalitateBucuresti.nume}, ${apartment.AdresaBucuresti.LocalitateBucuresti.JudetBucuresti.nume}`
    }

    const getClientName = (client: any) => {
        return `${client.nume}, ${client.prenume}`
    }

    const getAgentName = (agent: any) => {
        return `${agent.nume}, ${agent.prenume}`
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
                        {/* <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                variant="outlined"
                                label="Pret inchiriere"
                                onChange={(e) => changeState("pretInchiriere", e.currentTarget.value) } 
                                value={rentFields.pretInchiriere}
                                type="number"
                            />
                        </FormControl> */}
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Ziua scandenta"
                                onChange={(e) => changeState("ziuaScandenta", e.currentTarget.value) } 
                                value={rentFields.ziuaScandenta}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data inceput"
                                    onChange={(e) => changeState("dataInceput", e) } 
                                    value={rentFields.dataInceput}
                                    format="DD.MM.YYYY"
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data final"
                                    onChange={(e) => changeState("dataFinal", e) } 
                                    value={rentFields.dataFinal}
                                    format="DD.MM.YYYY"
                                    minDate={rentFields.dataInceput}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        {
                            editContract ?
                                <FormControl sx={{
                                    ...FormStyle
                                }}>
                                    <Autocomplete 
                                        options={(allApartments ?? []).map((apartment: any) => apartment)}
                                        renderInput={(params) => <TextField {...params} label="Apartament" />}
                                        getOptionLabel={(option) => {
                                            return getApartmentFullAddress(option)
                                        }}
                                        onChange={(_, value) => changeState("apartament", value)}
                                        isOptionEqualToValue={(option, value) => option.idApartament == value.idApartament}
                                        value={rentFields.apartament}
                                    />
                                </FormControl>
                                :
                                <FormControl sx={{
                                    ...FormStyle
                                }}>
                                    <Autocomplete 
                                        options={(apartments ?? []).map((apartment: any) => apartment)}
                                        renderInput={(params) => <TextField {...params} label="Apartament" />}
                                        getOptionLabel={(option) => {
                                            return getApartmentFullAddress(option)
                                        }}
                                        onChange={(_, value) => changeState("apartament", value)}
                                        isOptionEqualToValue={(option, value) => option.idApartament == value.idApartament}
                                        value={rentFields.apartament}
                                    />
                                </FormControl>
                        }
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <Autocomplete 
                                options={(clients ?? []).map((client: any) => client)}
                                renderInput={(params) => <TextField {...params} label="Clienti" />}
                                getOptionLabel={(option) => {
                                    return getClientName(option)
                                }}
                                onChange={(_, value) => changeState("chirias", value)}
                                isOptionEqualToValue={(option, value) => option.idChirias == value.idChirias}
                                value={rentFields.chirias}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <Autocomplete 
                                options={(agents ?? []).map((agent: any) => agent)}
                                renderInput={(params) => <TextField {...params} label="Agenti" />}
                                getOptionLabel={(option) => {
                                    return getAgentName(option)
                                }}
                                onChange={(_, value) => changeState("agent", value)}
                                isOptionEqualToValue={(option, value) => option.idAgent == value.idAgent}
                                value={rentFields.agent}
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editContract)
                                    editAgentAction()  
                                else 
                                    createAgentAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editContract ?
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

export default RentPanel;