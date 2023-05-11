import * as React from 'react';
import { deleteApartmnetDB, getApartments } from './apartments.page.requests';
import { useMemo, useState } from 'react';
import { Snackbar } from '@mui/material';
import './apartments.page.css';
import { observer } from 'mobx-react-lite';
import { DialogContext, PanelContext, ToastContext } from '../../mobx/store';
import ApartmentPanel from './components/apartment/apartment.panel';
import TableComponent from '../../components/table/table.component';
import { AddressType, styleHeader } from '../addresses/addresses.page';
import { MenuActionItemsType, TableHeaderTypes } from '../../components/table/table.component.types';

export type ApartmentType = {
    idApartament: number,
    etaj: string,
    centralaProprie: string,
    numarCamere: number,
    pretInchiriere: number,
    suprafata: number,
    tipConfort: number,
    ID_ADRESA: number,
    AdresaProvincie?: AddressType
}

const  ApartmentsProvinciePage = observer(() => {

  const [apartments, setApartments] = React.useState<ApartmentType[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const panelState = React.useContext(PanelContext);
  const toastState = React.useContext(ToastContext);
  const dialogState = React.useContext(DialogContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentApartment, setCurrentApartment] = useState<any>()

  React.useEffect(
    () => {
        setLoading(() => true)
        getApartments()
        .then(data => setApartments(() => data))
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    []
  ) 

  React.useEffect(
    () => {
        if(!panelState.refreshData?.refreshApartments) return; 
        setLoading(() => true)
        getApartments()
        .then(data => {
            setApartments(() => data);
            panelState.setRefreshData(undefined);
        })
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    [panelState.refreshData]
  )

  const tableHeadersApartament: TableHeaderTypes[] = useMemo(
    () => {
        return [
            {
                style: styleHeader,
                value: "Etaj",
                align: "left"
            },
            {
                style: styleHeader,
                value: "Adresa"
            },
            {
                style: styleHeader,
                value: "Centrala proprie"
            },
            {
                style: styleHeader,
                value: "Numar camere"
            },
            {
                style: styleHeader,
                value: "Tip confort"
            },
            {
                style: styleHeader,
                value: "Suprafata (m^2)"
            },
            {
                style: styleHeader,
                value: "Pret Inchiriere (RON)"
            }
        ]
    },
    []
  )

  const rowsApartamente: TableHeaderTypes[] = useMemo(
    () => {
        if(!apartments) return []

        return apartments.map((apartment: ApartmentType) => {
            return {
                value: {
                    etaj: {
                      align: "left",
                      value: apartment.etaj
                    },
                    adresa: {
                      value: `${apartment.AdresaProvincie?.strada}, ${apartment.AdresaProvincie?.numar}, ${apartment.AdresaProvincie?.bloc}, ${apartment.AdresaProvincie?.scara}, ${apartment.AdresaProvincie?.numarApartament}, ${apartment.AdresaProvincie?.LocalitateProvincie.nume}, ${apartment.AdresaProvincie?.LocalitateProvincie.JudetProvincie.nume}`
                    },
                    centralaProprie: {
                      value: apartment.centralaProprie
                    },
                    numarCamere: {
                      value: apartment.numarCamere
                    },
                    tipConfort: {
                      value: apartment.tipConfort
                    },
                    suprafata: {
                      value: apartment.suprafata
                    },
                    pretInchiriere: {
                      value: apartment.pretInchiriere
                    },
                    idAdresa: {
                      value: apartment.ID_ADRESA,
                      hideCell: true
                    },
                    idApartament: {
                      value: apartment.idApartament,
                      hideCell: true
                    }
                }
            }
        })
    },
    [apartments]
  )

  const createPanel = () => {

    panelState.setOpenPanel({
        body: (<ApartmentPanel />)
    });
    setAnchorEl(null);
  }

  const menuActionItems: MenuActionItemsType[] = useMemo(
    () => {
  
        if(!currentApartment) return [];
  
        let currentApartmentValues = {
          etaj: (currentApartment?.etaj as any).value,
          centralaProprie: (currentApartment?.centralaProprie as any).value,
          numarCamere: (currentApartment?.numarCamere as any).value,
          tipConfort: (currentApartment?.tipConfort as any).value,
          suprafata: (currentApartment?.suprafata as any).value,
          pretInchiriere: (currentApartment?.pretInchiriere as any).value,
          idAdresa: (currentApartment?.idAdresa as any).value,
          idApartament: (currentApartment?.idApartament as any).value
        }

        return [
            {
                action: () => {
                  panelState.setOpenPanel({
                    body: (<ApartmentPanel editApartment={currentApartmentValues} />)
                });
                },
                actionTitle: "Edit"
            },
            {
                action: () => {
                  dialogState.setDialog({
                    open: true,
                    dialogTitle: "Stergi apartamentul...",
                    dialogContent: "Esti sigur ca vrei sa stergi apartamentul?",
                    actionOne: () => {
                        dialogState.setDialog(undefined);
                        setAnchorEl(null);
                    },
                    textButtonOne: "Anuleaza",
                    actionTwo: async () => {
                        try {
                            await deleteApartmnetDB((currentApartment as any).idApartament.value);
                            dialogState.setDialog(undefined);
                            panelState.setRefreshData({
                                refreshApartments: true
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
    [currentApartment]
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
                    items: tableHeadersApartament,
                    style: {
                        backgroundColor: "black",
                    }
                }}
                rows={rowsApartamente}
                menuActionItems={{
                    actions: menuActionItems,
                    title: {
                        value: "Actions",
                        align: "right",
                        style: styleHeader
                    }
                }}
                rowDetails={(value) => setCurrentApartment(() => value)}
                loading={loading}
                headerButtonTitle="Adauga apartament"
                headerButton={createPanel}
                title="Apartamente Provincie"
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
  );
})

export default ApartmentsProvinciePage;