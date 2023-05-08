import { Link } from "react-router-dom"

const Navigation = () => {

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
                <Link to="/">Acasa</Link>
                <Link to="/apartments">Apartamente</Link>
                <Link to="/addresses">Adrese</Link>
                <Link to="/agents">Agenti</Link>
                <Link to="/clients">Clienti</Link>
                <Link to="/contracts">Contracte</Link>
                <Link to="/payrent">Plata Chirie</Link>
            </div>

        </div>
    )
}

export default Navigation;