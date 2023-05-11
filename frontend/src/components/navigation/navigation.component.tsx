import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom"
import { NavigationContext } from "../../mobx/store";
import { useContext } from "react";
import { NavigationEnum } from "../../utils/navigation.enum";

const Navigation = observer(() => {

    const navigationState = useContext(NavigationContext)

    return (
        <div style={{
            backgroundColor: "rgb(245, 237, 228)",
            padding: "2rem"
        }}>
            <div
                style={{
                    display: "flex",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    border: "1px solid black",
                    justifyContent: "space-between",
                    padding: "1rem",
                    backgroundColor: "rgb(245, 237, 228)",
                    borderRadius: "8px"
                }}
            >
                <Link to="/" onClick={() => navigationState.setCurrentTab(NavigationEnum.None)}>Acasa</Link>

                {
                    navigationState.currentTab === NavigationEnum.None ?
                        <>
                            <Link to="/national/apartments" onClick={() => navigationState.setCurrentTab(NavigationEnum.National)}>National</Link>
                            <Link to="/bucuresti/apartments" onClick={() => navigationState.setCurrentTab(NavigationEnum.Bucuresti)}>Bucuresti</Link>
                            <Link to="/provincie/apartments" onClick={() => navigationState.setCurrentTab(NavigationEnum.Provincie)}>Provincie</Link>
                        </>
                        :
                        ""

                }

                {
                    navigationState.currentTab === NavigationEnum.National ?
                        <>
                            <Link to="/national/apartments">Apartamente</Link>
                            <Link to="/national/addresses">Adrese</Link>
                            <Link to="/national/agents">Agenti</Link>
                            <Link to="/national/clients">Clienti</Link>
                            <Link to="/national/contracts">Contracte</Link>
                            <Link to="/national/payrent">Plata Chirie</Link>
                        </>
                        :
                        ""
                }

                {
                    navigationState.currentTab === NavigationEnum.Bucuresti ?
                        <>
                            <Link to="/bucuresti/apartments">Apartamente</Link>
                            <Link to="/bucuresti/addresses">Adrese</Link>
                            <Link to="/bucuresti/clients">Clienti</Link>
                            <Link to="/bucuresti/contracts">Contracte</Link>
                            <Link to="/bucuresti/payrent">Plata Chirie</Link>
                        </>
                        :
                        ""
                }

                {
                    navigationState.currentTab === NavigationEnum.Provincie ?
                        <>
                            <Link to="/provincie/apartments">Apartamente</Link>
                            <Link to="/provincie/addresses">Adrese</Link>
                            <Link to="/provincie/clients">Clienti</Link>
                            <Link to="/provincie/contracts">Contracte</Link>
                            <Link to="/provincie/payrent">Plata Chirie</Link>
                        </>
                        :
                        ""
                }

            </div>

        </div>
    )
})

export default Navigation;