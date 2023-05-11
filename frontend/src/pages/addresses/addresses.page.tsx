import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, LinearProgress, Menu, MenuItem, Snackbar, TableHead } from '@mui/material';
// import './apartments.page.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { observer } from 'mobx-react-lite';
import { DialogContext, PanelContext, ToastContext } from '../../mobx/store';
import { deleteAddressDB, getAddresses } from './addresses.page.requests';
import AddressPanel from './components/addresses-panel/addresses.panel';
import { MenuActionItemsType, TableHeaderTypes } from '../../components/table/table.component.types';
import TableComponent from '../../components/table/table.component';

export type LocalitateType = {
  idLocalitate: number,
  nume: string,
  Judet: JudetType
}

export type JudetType = {
  idJudet: number,
  nume: string
}

export type AddressType = {
    bloc: string,
    idAdresa: number,
    idLocalitate: number,
    numar: number,
    numarApartament: number,
    scara: string,
    strada: string,
    Localitate: LocalitateType
}

export const styleHeader =  {
    color: "white",
    fontWeight: "bold"
}

const  AdressesPage = observer(() => {

  const [addresses, setAddresses] = React.useState<AddressType[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const panelState = useContext(PanelContext);
  const dialogState = useContext(DialogContext);
  const toastState = useContext(ToastContext);
  const [currentAddress, setCurrentAddress] = useState<AddressType>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  

  const tableHeadersAdrese: TableHeaderTypes[] = useMemo(
    () => {
        return [
            {
                style: styleHeader,
                value: "Bloc",
                align: "left"
            },
            {
                style: styleHeader,
                value: "Numar"
            },
            {
                style: styleHeader,
                value: "Numar apartament"
            },
            {
                style: styleHeader,
                value: "Scara"
            },
            {
                style: styleHeader,
                value: "Strada"
            },
            {
                style: styleHeader,
                value: "Localitate"
            },
            {
                style: styleHeader,
                value: "Judet"
            }
        ]
    },
    [styleHeader]
  )

  const rowsAchievements: TableHeaderTypes[] = useMemo(
    () => {
        if(!addresses) return []

        return addresses.map(address => {
            return {
                value: {
                    bloc: {
                      align: "left",
                      value: address.bloc
                    },
                    numar: {
                      value: address.numar
                    },
                    numarApartament: {
                      value: address.numarApartament
                    },
                    scara: {
                      value: address.scara
                    },
                    strada: {
                      value: address.strada
                    },
                    localitate: {
                      value: address.Localitate.nume
                    },
                    judet: {
                      value: address.Localitate.Judet.nume
                    },
                    idLocalitate: {
                      value: address.Localitate.idLocalitate,
                      hideCell: true
                    },
                    idAdresa: {
                      value: address.idAdresa,
                      hideCell: true
                    }
                }
            }
        })
    },
    [addresses]
  )

  useEffect(
    () => {
        setLoading(() => true)
        getAddresses()
        .then(data => setAddresses(() => data))
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    []
  ) 

  useEffect(
    () => {
        if(!panelState.refreshData?.refreshAddresses) return; 

        setLoading(() => true)
        getAddresses()
        .then(data => {
          setAddresses(() => (data as any[]));
          panelState.setRefreshData(undefined);
        })
        .catch(e => console.log(e))
        .finally(() => setLoading(() => false))
    },
    [panelState.refreshData]
)

const createPanel = () => {

  panelState.setOpenPanel({
      body: (<AddressPanel />)
  });
  setAnchorEl(null);
}

const menuActionItems: MenuActionItemsType[] = useMemo(
  () => {

      if(!currentAddress) return [];

      let currentAddressValues = {
        strada: (currentAddress?.strada as any).value,
        numar: (currentAddress?.numar as any).value,
        bloc: (currentAddress?.bloc as any).value,
        scara: (currentAddress?.scara as any).value,
        numarApartament: (currentAddress?.numarApartament as any).value,
        ID_LOCALITATE: (currentAddress?.idLocalitate as any).value,
        idAdresa: (currentAddress?.idAdresa as any).value
      }
      return [
          {
              action: () => {
                panelState.setOpenPanel({
                    body: (<AddressPanel editAddress={currentAddressValues} />)
                });
              },
              actionTitle: "Edit"
          },
          {
              action: () => {
                dialogState.setDialog({
                  open: true,
                  dialogTitle: "Stergi adresa...",
                  dialogContent: "Esti sigur ca vrei sa stergi adresa?",
                  actionOne: () => {
                      dialogState.setDialog(undefined);
                      setAnchorEl(null);
                  },
                  textButtonOne: "Anuleaza",
                  actionTwo: async () => {
                      try {
                          await deleteAddressDB((currentAddress as any).idAdresa.value);
                          dialogState.setDialog(undefined);
                          panelState.setRefreshData({
                            refreshAddresses: true
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
  [currentAddress]
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
                    items: tableHeadersAdrese,
                    style: {
                        backgroundColor: "black",
                    }
                }}
                rows={rowsAchievements}
                menuActionItems={{
                    actions: menuActionItems,
                    title: {
                        value: "Actions",
                        align: "right",
                        style: styleHeader
                    }
                }}
                rowDetails={(value) => setCurrentAddress(() => value)}
                loading={loading}
                headerButtonTitle="Adauga adresa"
                headerButton={createPanel}
                title="Adrese National"
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

export default AdressesPage;