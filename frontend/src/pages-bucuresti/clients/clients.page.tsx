import { Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AgentPanel from "./components/client-panel/client.panel";
import ClientPanel from "./components/client-panel/client.panel";
import { deleteClientDB, getClients } from "./clients.page.requests";
import TableComponent from "../../components/table/table.component";
import { styleHeader } from "../addresses/addresses.page";
import { MenuActionItemsType, TableHeaderTypes } from "../../components/table/table.component.types";

export type ClientType = {
    idChirias: number,
    prenume: string,
    nume: string,
    telefon: string,
    email: string,
    sex: string,
    dataNastere: Date,
    stareaCivila: string,
}

const ClientsBucurestiPage = observer(() => {

    const [clients, setClients] = useState<ClientType[]>()
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentClient, setCurrentClient] = useState<any>()

    useEffect(
        () => {
            setLoading(() => true)
            getClients()
            .then(data => setClients(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
      ) 
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshClients) return; 

            setLoading(() => true)
            getClients()
            .then(data => {
                setClients(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const createPanel = () => {

        panelState.setOpenPanel({
            body: (<ClientPanel />)
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
                        }
                    }
                }
            })
        },
        [clients]
    )

    const menuActionItems: MenuActionItemsType[] = useMemo(
        () => {
            
            if(!currentClient) return [];
      
            let currentClientValues = {
                nume: (currentClient?.nume as any).value,
                prenume: (currentClient?.prenume as any).value,
                telefon: (currentClient?.telefon as any).value,
                email: (currentClient?.email as any).value,
                dataNastere: (currentClient?.dataNastere as any).value,
                sex: (currentClient?.sex as any).value,
                stareaCivila: (currentClient?.stareaCivila as any).value,
                idChirias: (currentClient?.idChirias as any).value,
            }
    
            return [
                {
                    action: () => {
                        panelState.setOpenPanel({
                            body: (<ClientPanel editClient={currentClientValues} />)
                        });
                    },
                    actionTitle: "Edit"
                },
                {
                    action: () => {
                        dialogState.setDialog({
                            open: true,
                            dialogTitle: "Stergi clientul...",
                            dialogContent: "Esti sigur ca vrei sa stergi clientul?",
                            actionOne: () => {
                                dialogState.setDialog(undefined);
                                setAnchorEl(null);
                            },
                            textButtonOne: "Anuleaza",
                            actionTwo: async () => {
                                try {
                                    await deleteClientDB((currentClient as any).idChirias.value);
                                    dialogState.setDialog(undefined);
                                    panelState.setRefreshData({
                                        refreshClients: true
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
        [currentClient]
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
            <TableComponent
                tableHeaders={{
                    items: tableHeadersClient,
                    style: {
                        backgroundColor: "black",
                    }
                }}
                rows={rowsClienti}
                menuActionItems={{
                    actions: menuActionItems,
                    title: {
                        value: "Actions",
                        align: "right",
                        style: styleHeader
                    }
                }}
                rowDetails={(value) => setCurrentClient(() => value)}
                loading={loading}
                headerButtonTitle="Adauga chirias"
                headerButton={createPanel}
                title="Chiriasi Bucuresti"
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
    )

})

export default ClientsBucurestiPage;