const HomePage = () => {
    return (
        <div
            style={{
                height: "85vh",
                width: "100vw",
                backgroundColor: "rgb(245, 237, 228)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        >
            <div
                style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textAlign: "center"
                }}
            >
                Proiect MODBD
            </div>
            <div
                style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    textAlign: "center"
                }}
            >
                Platforma de inchiriere
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <div
                    style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        marginTop: "5rem"
                    }}
                >
                    Membrii echipei:
                </div>
                <div
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    <ul>
                        <li>Oprian Adrian George</li>
                        <li>Gherta Petru</li>
                        <li>Boranescu Alexandru-Nicolae</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomePage;