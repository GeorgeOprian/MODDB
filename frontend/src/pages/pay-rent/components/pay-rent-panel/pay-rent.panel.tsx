import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { FormStyle } from "./pay-rent.panel.style";
import { getClientContracts } from "../../pay-rent.page.requests";
import { createPayRentDB, editContractDB, editPayRentDB } from "../../../rent/rent.page.requests";

type RentPanelType = {
    editPayRent?: PayRentFields,
    idChirias?: number
}

type PayRentFields = {
    idPlata?: number,
    dataEfectuarii: Date | null | Dayjs,
    suma: number | null ,
    nrZileIntarziere: number | null ,
    ID_CONTRACT?: number | null,
    contract: null
}

const PayRentPanel = ({
    editPayRent,
    idChirias
}: RentPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [payRentFields, setPayRentField] = useState<PayRentFields>({
       dataEfectuarii: null,
       nrZileIntarziere: null,
       suma: 0,
       contract: null
    });
    const [clientContracts, setClientContracts] = useState<any[]>();

    const changeState = (key: any, value: any) => {
        setPayRentField({
            ...payRentFields,
            [key]: value
        })
    }


    useEffect(
        () => {
            if(!editPayRent || !clientContracts) return;

            setPayRentField(() => ({
                dataEfectuarii: dayjs(editPayRent.dataEfectuarii),
                nrZileIntarziere: editPayRent.nrZileIntarziere,
                suma: editPayRent.suma,
                contract: clientContracts?.find(f => f.idContract == editPayRent.ID_CONTRACT)
            }));
        },
        [editPayRent, clientContracts]
    )

    useEffect(
        () => {
            setIsLoading(() => true)
            getClientContracts(idChirias)
            .then(
                data => setClientContracts(() => data)
            )
            .catch((e) => console.log(e))
            .finally(() => setIsLoading(() => false))

        },
        []
    )

    const editPayRentAction = async () => {

        const bodyRentPaid = {
            luna: new Date((payRentFields.dataEfectuarii as any)).getMonth() + 1,
            an: new Date((payRentFields.dataEfectuarii as any)).getFullYear(),
            suma: payRentFields.suma,
            dataEfectuarii: new Date((payRentFields.dataEfectuarii as any)),
            nrZileIntarziere: payRentFields.nrZileIntarziere,
            ID_CONTRACT: (payRentFields.contract as any).idContract
        }

        try {
            await editPayRentDB(bodyRentPaid, (editPayRent?.idPlata as any));
            await editContractDB({incasari: Number((payRentFields as any).contract.incasari) + Number(payRentFields.suma)}, (payRentFields.contract as any).idContract)
            panelState.closePanel();
            panelState.setRefreshData({
                refreshPaidRents: true
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

    const createPayRentAction = async () => {

        const bodyRentPaid = {
            luna: new Date((payRentFields.dataEfectuarii as any)).getMonth() + 1,
            an: new Date((payRentFields.dataEfectuarii as any)).getFullYear(),
            suma: payRentFields.suma,
            dataEfectuarii: new Date((payRentFields.dataEfectuarii as any)),
            nrZileIntarziere: payRentFields.nrZileIntarziere,
            ID_CONTRACT: (payRentFields.contract as any).idContract
        }

        try {
            await createPayRentDB(bodyRentPaid);
            await editContractDB({incasari: Number((payRentFields as any).contract.incasari) + Number(payRentFields.suma)}, (payRentFields.contract as any).idContract)
            panelState.closePanel();
            panelState.setRefreshData({
                refreshPaidRents: true
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

    useEffect(
        () => {
            if(!payRentFields.contract) return;

            setPayRentField({
                ...payRentFields,
                suma: editPayRent ? editPayRent.suma : (payRentFields.contract as any).Apartament.pretInchiriere
            })
        },
        [payRentFields.contract]
    )
    const getApartmentFullAddress = (contract: any) => {
        return `${contract.Apartament.Adresa.strada}, ${contract.Apartament.Adresa.numar}, ${contract.Apartament.Adresa.bloc}, ${contract.Apartament.Adresa.scara}, ${contract.Apartament.Adresa.numarApartament}, ${contract.Apartament.Adresa.Localitate.nume}, ${contract.Apartament.Adresa.Localitate.Judet.nume}`
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data efectuarii"
                                    onChange={(e) => changeState("dataEfectuarii", e) } 
                                    value={payRentFields.dataEfectuarii}
                                    format="DD.MM.YYYY"
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Suma"
                                onChange={(e) => changeState("suma", e.currentTarget.value) } 
                                value={payRentFields.suma}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Numar zile intarziere"
                                onChange={(e) => changeState("nrZileIntarziere", e.currentTarget.value) } 
                                value={payRentFields.nrZileIntarziere}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <Autocomplete 
                                options={(clientContracts ?? []).map((contract: any) => contract)}
                                renderInput={(params) => <TextField {...params} label="Apartamente" />}
                                getOptionLabel={(option) => {
                                    return getApartmentFullAddress(option)
                                }}
                                onChange={(_, value) => changeState("contract", value)}
                                isOptionEqualToValue={(option, value) => option.idContract == value.idContract}
                                value={payRentFields.contract}
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editPayRent)
                                    editPayRentAction()  
                                else 
                                    createPayRentAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editPayRent ?
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

export default PayRentPanel;