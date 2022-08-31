import axios from "axios";
import { useState } from "react";
import QrReader from "react-qr-scanner";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/reducer/notificationSlice";
import { retryAxios } from "../../utils";
// import "./styles.css";

export default function QRScanner() {
  const [data, setData] = useState();
  const [showDialog, setDiaglog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [precScan, setPrecScan] = useState("");
  const [selected, setSelected] = useState("front");

  const dispatch = useDispatch();

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "" && !showDialog && !processing) {
      setProcessing(true);
      setPrecScan(scanData);
      retryAxios(axios);
      try {
        const response = await axios.get(scanData);
        setData(response.data);
      } catch (error) {
        dispatch(addNotification({ message: error.message }));
      }
    }
  };
  return (
    <div className="App">
      <h1>QR Scanner</h1>
      <h2>
        Last Scan:{precScan}
        {selected}
      </h2>
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value={"front"}>Back Camera</option>
        <option value={"rear"}>Front Camera</option>
      </select>
      {showDialog && (
        <div className="dialog">
          <div className="dialog-content">
            <div className="close">
              <button
                onClick={() => {
                  setDiaglog(false);
                  setProcessing(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {data && (
              <div className="description">
                <h4 className="title">Scan Result</h4>
                <div className="detail detail-first-child">
                  <h6 className="detail-header">Matricule :</h6>
                  <h6 className="detail-content green">{data.text}</h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Identité :</h6>
                  <h6 className="detail-content">{data.identite}</h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Pomotion :</h6>
                  <h6 className="detail-content">{data.promotion}</h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Année Academique :</h6>
                  <h6 className="detail-content">{data.annee}</h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Total payé :</h6>
                  <h6 className="detail-content red">
                    {data.frais} (USD,dollars americains)
                  </h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Total prévu :</h6>
                  <h6 className="detail-content red">
                    {data.total} (USD,dollars americains)
                  </h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Reste à payer :</h6>
                  <h6 className="detail-content red">
                    {data.total - data.frais} (USD,dollars americains)
                  </h6>
                </div>
                <div className="detail">
                  <h6 className="detail-header">Votre Situation :</h6>
                  <h6
                    className={
                      data.total <= data.frais
                        ? `detail-content green`
                        : "detail-content red small"
                    }
                  >
                    {data.total <= data.frais
                      ? "Eligible"
                      : "Vous etes en retard de payement"}
                  </h6>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!showDialog && !processing && (
        <QrReader
          facingMode={selected}
          delay={500}
          onError={(err) => dispatch(addNotification({ message: err }))}
          onScan={handleScan}
          // chooseDeviceId={()=>selected}
          style={{ width: "200px", heigth: "100px" }}
        />
      )}
    </div>
  );
}
