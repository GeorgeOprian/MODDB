import { observer } from "mobx-react-lite"
import { useContext, useEffect, useMemo, useState } from "react";
import { DialogContext, PanelContext, ToastContext } from "../../mobx/store";
import { Snackbar } from "@mui/material";
import { deleteContractDB, getActiveContracts, getContracts } from "./rent.page.requests";
import RentPanel from "./components/rent-panel/rent.panel";
import TableComponent from "../../components/table/table.component";
import { styleHeader } from "../addresses/addresses.page";
import { MenuActionItemsType, TableHeaderTypes } from "../../components/table/table.component.types";
import { ClientType } from "../clients/clients.page";
import { ApartmentType } from "../apartments/apartments.page";
import { AgentType } from "../agents/agents.page";

export type ContractType = {
    idContract: number,
    dataInceput: Date,
    dataFinal: Date,
    ziuaScandenta: number,
    pretInchiriere: number,
    valoareEstimata: number,
    incasari: number,
    Chiria: ClientType,
    Apartament: ApartmentType,
    AgentImobiliar: AgentType
}

const RentPage = observer(() => {

    const [contracts, setContracts] = useState<any[]>();
    const [activeContracts, setActiveContracts] = useState<any[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const panelState = useContext(PanelContext);
    const toastState = useContext(ToastContext);
    const dialogState = useContext(DialogContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentContract, setCurrentContract] = useState<any>();

    useEffect(
        () => {
            setLoading(() => true)
            getContracts()//contracts
            .then(data => setContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    )

    useEffect(
        () => {
            setLoading(() => true)
            getActiveContracts()//contracts
            .then(data => setActiveContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        []
    ) 
    
    useEffect(
        () => {
            if(!panelState.refreshData?.refreshContracts) return; 

            setLoading(() => true)
            getContracts()//contracts
            .then(data => {
                setContracts(() => (data as any[]));
                panelState.setRefreshData(undefined);
            })
            .catch(e => console.log(e))

            getActiveContracts()//contracts
            .then(data => setActiveContracts(() => (data as any[])))
            .catch(e => console.log(e))
            .finally(() => setLoading(() => false))
        },
        [panelState.refreshData]
    )

    const createPanel = () => {

        panelState.setOpenPanel({
            body: (<RentPanel  />)
        });
        setAnchorEl(null);
    }

    const tableHeadersContract: TableHeaderTypes[] = useMemo(
        () => {
            return [
                {
                    style: styleHeader,
                    value: "Adresa apartament",
                    align: "left"
                },
                {
                    style: styleHeader,
                    value: "Client"
                },
                {
                    style: styleHeader,
                    value: "Agent"
                },
                {
                    style: styleHeader,
                    value: "Data inceput"
                },
                {
                    style: styleHeader,
                    value: "Data final"
                },
                {
                    style: styleHeader,
                    value: "Ziua scandenta"
                },
                {
                    style: styleHeader,
                    value: "Pret inchiriere"
                },
                {
                    style: styleHeader,
                    value: "Incasari"
                }
            ]
        },
        []
    )
    
    const rowsActiveContracts: TableHeaderTypes[] = useMemo(
        () => {
            if(!activeContracts) return []
    
            return activeContracts.map((activeContract: ContractType) => {
                return {
                    value: {
                        adresaApartament: {
                          align: "left",
                          value: `${activeContract.Apartament.Adresa?.strada}, ${activeContract.Apartament.Adresa?.numar}, ${activeContract.Apartament.Adresa?.bloc}, ${activeContract.Apartament.Adresa?.scara}, ${activeContract.Apartament.Adresa?.numarApartament}, ${activeContract.Apartament.Adresa?.Localitate.nume}, 
                          ${activeContract.Apartament.Adresa?.Localitate.Judet.nume}`
                        },
                        client: {
                          value: `${activeContract.Chiria.nume} ${activeContract.Chiria.prenume}`
                        },
                        agent: {
                          value: `${activeContract.AgentImobiliar.nume} ${activeContract.AgentImobiliar.prenume}`
                        },
                        dataInceputFormatted: {
                            value: new Date(activeContract.dataInceput).toLocaleDateString('ro-RO').toString()
                        },
                        dataFinalFormatted: {
                          value: new Date(activeContract.dataFinal).toLocaleDateString('ro-RO').toString()
                        },
                        ziuaScandenta: {
                            value: activeContract.ziuaScandenta
                        },
                        pretInchiriere: {
                          value: activeContract.pretInchiriere
                        },
                        incasari: {
                          value: activeContract.incasari
                        },
                        idChirias: {
                          value: activeContract.Chiria.idChirias,
                          hideCell: true
                        },
                        idAgent: {
                            value: activeContract.AgentImobiliar.idAgent,
                            hideCell: true
                        },
                        idApartament: {
                            value: activeContract.Apartament.idApartament,
                            hideCell: true
                        },
                        idContract: {
                            value: activeContract.idContract,
                            hideCell: true
                        },
                        dataInceput: {
                            value: activeContract.dataInceput,
                            hideCell: true
                        },
                        dataFinal: {
                          value: activeContract.dataFinal,
                          hideCell: true
                        },
                    }
                }
            })
        },
        [activeContracts]
    )

    const rowsAllContracts: TableHeaderTypes[] = useMemo(
        () => {
            if(!contracts) return []
    
            return contracts.map((contract: ContractType) => {
                return {
                    value: {
                        adresaApartament: {
                          align: "left",
                          value: `${contract.Apartament.Adresa?.strada}, ${contract.Apartament.Adresa?.numar}, ${contract.Apartament.Adresa?.bloc}, ${contract.Apartament.Adresa?.scara}, ${contract.Apartament.Adresa?.numarApartament}, ${contract.Apartament.Adresa?.Localitate.nume}, 
                          ${contract.Apartament.Adresa?.Localitate.Judet.nume}`
                        },
                        client: {
                          value: `${contract.Chiria.nume} ${contract.Chiria.prenume}`
                        },
                        agent: {
                          value: `${contract.AgentImobiliar.nume} ${contract.AgentImobiliar.prenume}`
                        },
                        dataInceputFormatted: {
                            value: new Date(contract.dataInceput).toLocaleDateString('ro-RO').toString()
                        },
                        dataFinalFormatted: {
                          value: new Date(contract.dataFinal).toLocaleDateString('ro-RO').toString()
                        },
                        ziuaScandenta: {
                            value: contract.ziuaScandenta
                        },
                        pretInchiriere: {
                          value: contract.pretInchiriere
                        },
                        incasari: {
                          value: contract.incasari
                        },
                        idChirias: {
                          value: contract.Chiria.idChirias,
                          hideCell: true
                        },
                        idAgent: {
                            value: contract.AgentImobiliar.idAgent,
                            hideCell: true
                        },
                        idApartament: {
                            value: contract.Apartament.idApartament,
                            hideCell: true
                        },
                        idContract: {
                            value: contract.idContract,
                            hideCell: true
                        },
                        dataInceput: {
                            value: contract.dataInceput,
                            hideCell: true
                        },
                        dataFinal: {
                          value: contract.dataFinal,
                          hideCell: true
                        },
                    }
                }
            })
        },
        [contracts]
    )

    const menuActionItems: MenuActionItemsType[] = useMemo(
        () => {
            
            if(!currentContract) return [];
      
            let currentContractValues = {
                idContract: (currentContract?.idContract as any).value,
                dataInceput: (currentContract?.dataInceput as any).value,
                dataFinal: (currentContract?.dataFinal as any).value,
                ziuaScandenta: (currentContract?.ziuaScandenta as any).value,
                pretInchiriere: (currentContract?.pretInchiriere as any).value,
                incasari: (currentContract?.incasari as any).value,
                idApartament: (currentContract?.idApartament as any).value,
                idChirias: (currentContract?.idChirias as any).value,
                idAgent: (currentContract?.idAgent as any).value,
            }
    
            return [
                {
                    action: () => {
                        panelState.setOpenPanel({
                            body: (<RentPanel editContract={currentContractValues} />)
                        });
                    },
                    actionTitle: "Edit"
                },
                {
                    action: () => {
                        dialogState.setDialog({
                            open: true,
                            dialogTitle: "Stergi contractul...",
                            dialogContent: "Esti sigur ca vrei sa stergi contractul?",
                            actionOne: () => {
                                dialogState.setDialog(undefined);
                                setAnchorEl(null);
                            },
                            textButtonOne: "Anuleaza",
                            actionTwo: async () => {
                                try {
                                    await deleteContractDB((currentContract as any).idContract.value);
                                    dialogState.setDialog(undefined);
                                    panelState.setRefreshData({
                                        refreshContracts: true
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
        [currentContract]
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
                        items: tableHeadersContract,
                        style: {
                            backgroundColor: "black",
                        }
                    }}
                    rows={rowsActiveContracts}
                    menuActionItems={{
                        actions: menuActionItems,
                        title: {
                            value: "Actions",
                            align: "right",
                            style: styleHeader
                        }
                    }}
                    rowDetails={(value) => setCurrentContract(() => value)}
                    loading={loading}
                    headerButtonTitle="Creeaza contract"
                    headerButton={createPanel}
                    title="Contracte active National"
                />

                <TableComponent
                    tableHeaders={{
                        items: tableHeadersContract,
                        style: {
                            backgroundColor: "black",
                        }
                    }}
                    rows={rowsAllContracts}
                    menuActionItems={{
                        actions: menuActionItems,
                        title: {
                            value: "Actions",
                            align: "right",
                            style: styleHeader
                        }
                    }}
                    rowDetails={(value) => setCurrentContract(() => value)}
                    loading={loading}
                    headerButtonTitle="Creeaza contract"
                    headerButton={createPanel}
                    title="Contracte National"
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

export default RentPage;