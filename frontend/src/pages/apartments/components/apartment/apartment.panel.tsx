import { Autocomplete, Button, CircularProgress, FormControl, FormGroup, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { createApartmentDB, editApartmentDB, getAddresses } from "../../apartments.page.requests";
import { PanelContext, ToastContext } from "../../../../mobx/store";
import { FormStyle } from "./apartment.panel.style";

type ApartmentPanelType = {
    editApartment?: any
}

const ApartmentPanel = ({
    editApartment
}: ApartmentPanelType) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [addresses, setAddresses] = useState<any[]>();
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);

    const [apartmentFields, setApartmentField] = useState({
        numarCamere: null,
        etaj: null,
        suprafata: null,
        centralaProprie: "",
        pretInchiriere: null,
        tipConfort: "",
        adresa: null
    })

    const changeState = (key: any, value: any) => {
        setApartmentField({
            ...apartmentFields,
            [key]: value
        })
    }

    useEffect(
        () => {
            setIsLoading(() => true)
            getAddresses()
            .then(
                data => setAddresses(() => data)
            )
            .catch((e) => console.log(e))
            .finally(() => setIsLoading(() => false))
        },
        []
    )

    useEffect(
        () => {
            if(!editApartment || !addresses) return;
           
            setApartmentField(() => ({
                centralaProprie: editApartment.centralaProprie,
                etaj: editApartment.etaj,
                numarCamere: editApartment.numarCamere,
                pretInchiriere: editApartment.pretInchiriere,
                suprafata: editApartment.suprafata,
                tipConfort: editApartment.tipConfort,
                adresa: addresses?.find(f => f.idAdresa === editApartment.ID_ADRESA)
            }));
        },
        [editApartment, addresses]
    )

    const getFullAddress = (address: any) => {
        return `${address["strada"]}, ${address["numar"]}, ${address["bloc"]}, ${address["scara"]}, ${address["numarApartament"]}, ${address["Localitate.nume"]}, ${address["Localitate.Judet.nume"]}`
    }

    const editApartmentAction = async () => {

        const body = {
            numarCamere: apartmentFields.numarCamere,
            etaj: apartmentFields.etaj,
            suprafata: apartmentFields.suprafata,
            centralaProprie: apartmentFields.centralaProprie,
            pretInchiriere: apartmentFields.pretInchiriere,
            tipConfort: apartmentFields.tipConfort,
            ID_ADRESA: (apartmentFields.adresa as any).idAdresa ?? 0
        }

        try {
            await  editApartmentDB(body, editApartment.idApartament);
            panelState.closePanel();
            panelState.setRefreshData({
                refreshApartments: true
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

    const createApartmentAction = async () => {

        const body = {
            numarCamere: Number(apartmentFields.numarCamere),
            etaj: Number(apartmentFields.etaj),
            suprafata: Number(apartmentFields.suprafata),
            centralaProprie: apartmentFields.centralaProprie,
            pretInchiriere: Number(apartmentFields.pretInchiriere),
            tipConfort: Number(apartmentFields.tipConfort),
            ID_ADRESA: (apartmentFields.adresa as any).idAdresa ?? 0
        }

        try {
            await  createApartmentDB(body);
            panelState.closePanel();
            panelState.setRefreshData({
                refreshApartments: true
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
                                label="Etaj"
                                onChange={(e) => changeState("etaj", e.currentTarget.value) } 
                                value={apartmentFields.etaj}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                id="numarCamere" 
                                label="Numar camere"
                                onChange={(e) => changeState("numarCamere", e.currentTarget.value) } 
                                value={apartmentFields.numarCamere}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                id="suprafata" 
                                label="Suprafata"
                                onChange={(e) => changeState("suprafata", e.currentTarget.value) } 
                                value={apartmentFields.suprafata}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                id="centralaProprie" 
                                label="Centrala proprie"
                                onChange={(e) => changeState("centralaProprie", e.currentTarget.value) } 
                                value={apartmentFields.centralaProprie}
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                id="pretInchiriere"
                                label="Pret inchiriere" 
                                onChange={(e) => changeState("pretInchiriere", e.currentTarget.value) } 
                                value={apartmentFields.pretInchiriere}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <TextField 
                                id="tipConfort" 
                                label="Tip confort"
                                onChange={(e) => changeState("tipConfort", e.currentTarget.value) } 
                                value={apartmentFields.tipConfort}
                                type="number"
                            />
                        </FormControl>
                        <FormControl sx={{
                            ...FormStyle
                        }}>
                            <Autocomplete 
                                options={(addresses ?? []).map((address: any) => address)}
                                renderInput={(params) => <TextField {...params} label="Adresa" />}
                                getOptionLabel={(option) => {
                                    return getFullAddress(option)
                                }}
                                onChange={(_, value) => changeState("adresa", value)}
                                isOptionEqualToValue={(option, value) => option.idAdresa === value.idAdresa}
                                value={apartmentFields.adresa}
                            />
                        </FormControl>
                        <Button 
                            variant="contained"
                            onClick={() => {
                                if(editApartment)
                                    editApartmentAction()  
                                else 
                                    createApartmentAction()
                            }}
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                editApartment ?
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

export default ApartmentPanel;