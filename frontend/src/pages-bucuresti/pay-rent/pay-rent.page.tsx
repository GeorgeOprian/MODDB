import { observer } from "mobx-react-lite"
import { useContext, useEffect, useMemo, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import { IconButton, Snackbar } from "@mui/material";
import { deletePayDB, getAllPaidRents, getClientWithRent } from "./pay-rent.page.requests";
import RentPanel from "./components/pay-rent-panel/pay-rent.panel";
import PayRentPanel from "./components/pay-rent-panel/pay-rent.panel";
import AddCardIcon from '@mui/icons-material/AddCard';
import Tooltip from '@mui/material/Tooltip';
import { editContractDB } from "../rent/rent.page.requests";
import TableComponent from "../../components/table/table.component";
import { MenuActionItemsType, TableHeaderTypes } from "../../components/table/table.component.types";
import { styleHeader } from "../addresses/addresses.page";
import { ClientType } from "../clients/clients.page";
import { ContractType } from "../rent/rent.page";

export type PayRentType = {
    idPlata: number,
    luna: number,
    an: number,
    suma: number,
    dataEfectuarii: Date,
    nrZileIntarziere: number,
    ContractBucuresti: ContractType
}

const PayRentBucurestiPage = observer(() => {

    const [clients, setClients] = useState<ClientType[]>();
    const [paidRents, setPaidRents] = useState<PayRentType[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [currentPaidRent, setCurrentPaidRent] = useState<any>()

    useEffect(
        () => {
            setLoading(() => true)

            getAllPaidRents()
            .then(data => setPaidRents(() => (data as any[])))
            .catch(e => console.log(e))

            getClientWithRent()//contracts
            .then(data => setClients(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    )
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshPaidRents) return; 

            setLoading(() => true)

            getAllPaidRents()
            .then(data => setPaidRents(() => (data as any[])))
            .catch(e => console.log(e))

            getClientWithRent()//contracts
            .then(data => {
                setClients(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const createPanel = (client: any) => {
        
        panelState.setOpenPanel({
            body: (<PayRentPanel idChirias={client.idChirias} />)
        });
        setAnchorEl(null);
    }

    const tableHeadersClient: TableHeaderTypes[] = useMemo(
        () => {
            return [
                {
                    style: styleHeader,
                    value: "Nume",
                    align: "left"
                },
                {
                    style: styleHeader,
                    value: "Prenume"
                },
                {
                    style: styleHeader,
                    value: "Telefon"
                },
                {
                    style: styleHeader,
                    value: "Email"
                },
                {
                    style: styleHeader,
                    value: "Data nastere"
                },
                {
                    style: styleHeader,
                    value: "Sex"
                },
                {
                    style: styleHeader,
                    value: "Stare civila"
                },
                {
                    style: styleHeader,
                    align: "right",
                    value: "Actiuni"
                }
            ]
        },
        []
    )
    
    const rowsClienti: TableHeaderTypes[] = useMemo(
        () => {
            if(!clients) return []
    
            return clients.map((client: ClientType) => {
                return {
                    value: {
                        nume: {
                          align: "left",
                          value: client.nume
                        },
                        prenume: {
                          value: client.prenume
                        },
                        telefon: {
                          value: client.telefon
                        },
                        email: {
                          value: client.email
                        },
                        dataNastereFormated: {
                          value: new Date(client.dataNastere).toLocaleDateString('ro-RO').toString()
                        },
                        sex: {
                            value: client.sex
                        },
                        stareaCivila: {
                          value: client.stareaCivila
                        },
                        idChirias: {
                          value: client.idChirias,
                          hideCell: true
                        },
                        dataNastere: {
                            value: client.dataNastere,
                            hideCell: true
                        },
                        plateste: {
                            align: "right",
                            value: (
                                <Tooltip title="Plateste">
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={open ? 'long-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={() => {
                                            createPanel(client)
                                        }}
                                    >
                                        <AddCardIcon />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                    }
                }
            })
        },
        [clients]
    )

    const tableHeadersPay: TableHeaderTypes[] = useMemo(
        () => {
            return [
                {
                    style: styleHeader,
                    value: "Adresa apartament",
                    align: "left"
                },
                {
                    style: styleHeader,
                    value: "Chirias"
                },
                {
                    style: styleHeader,
                    value: "Pret inchiriere"
                },
                {
                    style: styleHeader,
                    value: "Data efectuarii"
                },
                {
                    style: styleHeader,
                    value: "Numar zile intarziere"
                }
            ]
        },
        []
    )
    
    const rowsPay: TableHeaderTypes[] = useMemo(
        () => {
            if(!paidRents) return []

            return paidRents.map((paidRent: PayRentType) => {
                return {
                    value: {
                        adresaApartament: {
                          align: "left",
                          value: `${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.strada}, ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.numar}, ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.bloc}, ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.scara}, ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.numarApartament}, ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.LocalitateBucuresti.nume}, 
                          ${paidRent.ContractBucuresti.ApartamentBucuresti.AdresaBucuresti?.LocalitateBucuresti.JudetBucuresti.nume}`
                        },
                        client: {
                            value: `${paidRent.ContractBucuresti.ChiriasBucuresti.nume} ${paidRent.ContractBucuresti.ChiriasBucuresti.prenume}`
                        },
                        suma: {
                          value: paidRent.suma
                        },
                        dataEfectuariiFormatted: {
                          value: new Date(paidRent.dataEfectuarii).toLocaleDateString('ro-RO').toString()
                        },
                        nrZileIntarziere: {
                            value: paidRent.nrZileIntarziere
                        },
                        idChirias: {
                          value: paidRent.ContractBucuresti.ChiriasBucuresti.idChirias,
                          hideCell: true
                        },
                        idPlata: {
                          value: paidRent.idPlata,
                          hideCell: true
                        },
                        idContract: {
                          value: paidRent.ContractBucuresti.idContract,
                          hideCell: true
                        },
                        dataEfectuarii: {
                            value: paidRent.dataEfectuarii,
                            hideCell: true
                        },
                        incasari: {
                            value: paidRent.ContractBucuresti.incasari,
                            hideCell: true
                        }
                    }
                }
            })
        },
        [paidRents]
    )

    const menuActionItems: MenuActionItemsType[] = useMemo(
        () => {
            
            if(!currentPaidRent) return [];
      
            let currentPaidRentValues = {
                idPlata: (currentPaidRent?.idPlata as any).value,
                dataEfectuarii: (currentPaidRent?.dataEfectuarii as any).value,
                suma: (currentPaidRent?.suma as any).value,
                nrZileIntarziere: (currentPaidRent?.nrZileIntarziere as any).value,
                idContract: (currentPaidRent?.idContract as any).value
            }
    
            return [
                {
                    action: () => {
                        panelState.setOpenPanel({
                            body: (<PayRentPanel editPayRent={currentPaidRentValues} idChirias={(currentPaidRent as any).idChirias.value} />)
                        });
                    },
                    actionTitle: "Edit"
                },
                {
                    action: () => {
                        dialogState.setDialog({
                            open: true,
                            dialogTitle: "Stergi plata...",
                            dialogContent: "Esti sigur ca vrei sa stergi plata?",
                            actionOne: () => {
                                dialogState.setDialog(undefined);
                                setAnchorEl(null);
                            },
                            textButtonOne: "Anuleaza",
                            actionTwo: async () => {
                                try {
                                    await deletePayDB((currentPaidRent as any).idPlata.value);
                                    await editContractDB({incasari: Number((currentPaidRent as any).incasari.value) - Number((currentPaidRent as any).suma.value)}, (currentPaidRent as any).idContract.value)
                                    dialogState.setDialog(undefined);
                                    panelState.setRefreshData({
                                        refreshPaidRents: true
                                    });
                                    toastState.setToast({
                                        open: true,
                                        message: "Actiune realizata cu succes"
                                    });
                                    setAnchorEl(null);
                                } catch (error) {
                                    toastState.setToast({
                                        open: true,
                                        message: "Eroare"
                                    })
                                }
                                
                            },
                            textButtonTwo: "Sterge"
                        })
                    },
                    actionTitle: "Delete"
                }
            ]
        },
        [currentPaidRent]
    )

    return (
        <div 
            style={{
                paddingRight: "2rem",
                paddingLeft: "2rem",
                minHeight: "90vh",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <div>
                <TableComponent
                    tableHeaders={{
                        items: tableHeadersClient,
                        style: {
                            backgroundColor: "black",
                        }
                    }}
                    rows={rowsClienti}
                    loading={loading}
                    title="Chiriasi Bucuresti"
                />

                <TableComponent
                    tableHeaders={{
                        items: tableHeadersPay,
                        style: {
                            backgroundColor: "black",
                        }
                    }}
                    rows={rowsPay}
                    menuActionItems={{
                        actions: menuActionItems,
                        title: {
                            value: "Actions",
                            align: "right",
                            style: styleHeader
                        }
                    }}
                    rowDetails={(value) => setCurrentPaidRent(() => value)}
                    loading={loading}
                    title="Plati Bucuresti"
                />

                <Snackbar
                    anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'top'
                    }}
                    open={toastState.toast?.open}
                    onClose={() => toastState.setToast(undefined)}
                    message={toastState.toast?.message}   
                    autoHideDuration={2500}
                />
            </div>
        </div>
    )
})

export default PayRentBucurestiPage;