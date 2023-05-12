import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { FormStyle } from "./addresses.panel.style";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createAddressDB, editAddressDB, getCounties } from "../../addresses.page.requests";

type AddressPanelType = {
    editAddress?: AddressFields
}

type AddressFields = {
    idAdresa?: number,
    strada: string,
    numar: number | null,
    bloc: string,
    scara: string,
    numarApartament: number | null,
    ID_LOCALITATE?: number | null,
    localitate?: any
}

const AddressPanel = ({
    editAddress
}: AddressPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [addressFields, setAddressField] = useState<AddressFields>({
        bloc: "",
        ID_LOCALITATE: 0,
        numar: 0,
        numarApartament: 0,
        scara: "",
        strada: "",
        localitate: null
    })
    const [counties, setCounties] = useState<any[]>()

    const changeState = (key: any, value: any) => {
        setAddressField({
            ...addressFields,
            [key]: value
        })
    }


    useEffect(
        () => {
            console.log(editAddress)
            if(!editAddress || !counties) return;
           
            setAddressField(() => ({
                bloc: editAddress.bloc,
                ID_LOCALITATE: editAddress.ID_LOCALITATE,
                numar: editAddress.numar,
                numarApartament: editAddress.numarApartament,
                scara: editAddress.scara,
                strada: editAddress.strada,
                localitate: counties?.find(f => f.idLocalitate === editAddress.ID_LOCALITATE)
            }));
        },
        [editAddress, counties]
    )

    useEffect(
        () => {
            setIsLoading(() => true)
            getCounties()
            .then(
                data => setCounties(() => data)
            )
            .catch((e) => console.log(e))
            .finally(() => setIsLoading(() => false))
        },
        []
    )

    const editAddressAction = async () => {

        const body = {
            strada: addressFields.strada,
            numar: addressFields.numar,
            bloc: addressFields.bloc,
            scara: addressFields.scara,
            numarApartament: addressFields.numarApartament,
            ID_LOCALITATE: addressFields.localitate?.idLocalitate,
        }

        try {
            await editAddressDB(body, (editAddress?.idAdresa as any));
            panelState.closePanel();
            panelState.setRefreshData({
                refreshAddresses: true
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

    const createAddressAction = async () => {

        const body = {
            strada: addressFields.strada,
            numar: parseInt((addressFields.numar as any).toString()),
            bloc: addressFields.bloc,
            scara: addressFields.scara,
            numarApartament: parseInt((addressFields.numarApartament as any).toString()),
            ID_LOCALITATE: addressFields.localitate?.idLocalitate,
        }

        try {
            await  createAddressDB(body);
            panelState.closePanel();
            panelState.setRefreshData({
                refreshAddresses: true
            });
            toastState.setToast({
                open: true,
                message: "Actiune realizata cu succes"
            })
            
        } catch (error: any) {
            toastState.setToast({
                open: true,
                message: `${error.response.data.message}`
            })
        }
    }

    const getFullAddress = (county: any) => {
        return `${county.nume}, ${county.JudetBucuresti.nume}`
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
                                label="Bloc"
                                onChange={(e) => changeState("bloc", e.currentTarget.value) } 
                                value={addressFields.bloc}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Numar"
                                onChange={(e) => changeState("numar", e.currentTarget.value) } 
                                value={addressFields.numar}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Numar apartament"
                                onChange={(e) => changeState("numarApartament", e.currentTarget.value) } 
                                value={addressFields.numarApartament}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Scara"
                                onChange={(e) => changeState("scara", e.currentTarget.value) } 
                                value={addressFields.scara}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                label="Strada"
                                onChange={(e) => changeState("strada", e.currentTarget.value) } 
                                value={addressFields.strada}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <Autocomplete 
                                options={(counties ?? []).map((county: any) => county)}
                                renderInput={(params) => <TextField {...params} label="Localitate, Judet" />}
                                getOptionLabel={(option) => {
                                    return getFullAddress(option)
                                }}
                                onChange={(_, value) => changeState("localitate", value)}
                                isOptionEqualToValue={(option, value) => option.idLocalitate === value.idLocalitate}
                                value={addressFields.localitate}
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editAddress)
                                    editAddressAction()  
                                else 
                                    createAddressAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editAddress ?
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

export default AddressPanel;