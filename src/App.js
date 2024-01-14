import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Ensure this path is correct
import logoImage from './logo_without_bg.png'; // Make sure the path is correct
import AccessForm from './AccessForm' ;

function App() {
  const [selectedTable] = useState('convertcsv');
  const [values, setValues] = useState([]);
  const [selectedSphere, setSelectedSphere] = useState('');
  const [selectedCylinder, setSelectedCylinder] = useState('');
  const [sum, setSum] = useState('');
  const [userInput, setUserInput] = useState('');
  const [finalResult, setFinalResult] = useState('');
  const [uniqueSpheres, setUniqueSpheres] = useState([]);
  const [uniqueCylinders, setUniqueCylinders] = useState([]);
  const CONSTANT_VALUE = 120;
  const [hasAccess, setHasAccess] = useState(false);
 
  const handleAccessGranted = () => {
    setHasAccess(true);
  };
useEffect(() => {
  // Check if selectedTable is a valid numeric value or 'convertcsv'
  if (!isNaN(selectedTable) || selectedTable === 'convertcsv') {
    axios.get(`http://localhost:5000/api/values/${selectedTable}`)
      .then((response) => {
        setValues(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  } else {
    console.error('Invalid selectedTable: ', selectedTable);
  }
}, [selectedTable]);

 
 

  useEffect(() => {
    const value = values.find(v => v.sphere === parseFloat(selectedSphere) && v.cylinder === parseFloat(selectedCylinder));
    if (value) {
      setSum(value.sum);
    }
  }, [selectedSphere, selectedCylinder, values]);

  useEffect(() => {
    const sphereSet = new Set(values.map(item => item.sphere));
    const cylinderSet = new Set(values.map(item => item.cylinder));

    setUniqueSpheres([...sphereSet].sort((a, b) => b - a));
    setUniqueCylinders([...cylinderSet].sort((a, b) => b - a));
  }, [values]);

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const calculateFinalResult = () => {
    const inputNumber = parseInt(userInput, 10);
    if (!isNaN(inputNumber)) {
      const result = inputNumber - CONSTANT_VALUE - Math.round(sum * 1.1);
      setFinalResult(result);
    }
  };

  const handleFinalCalculation = (event) => {
    event.preventDefault();
    calculateFinalResult();
  };

  return (
    <div className="container">
    {!hasAccess ? (
      <AccessForm onAccessGranted={handleAccessGranted} />
    ) : (
      <>
        <img src={logoImage} alt="Company Logo" className="logo" />
        <h1>SMILE – Berechnung der Lentikeldicke und stromalen Restdicke</h1>

      <form id="calculationForm">
      <div className="form-section">
  <h2 className="subtitle">Lentikeldicke</h2>
 
  <label htmlFor="sphereSelect">Bitte auswählen: Sphäre [dpt]</label>
  <select id="sphereSelect" onChange={(e) => setSelectedSphere(e.target.value)} value={selectedSphere}>
    <option value="">Bitte auswählen</option>
    {uniqueSpheres.map((value, index) => (
      <option key={`sphere-${index}`} value={value}>{value}</option>
    ))}
  </select>

  <label htmlFor="cylinderSelect">Bitte auswählen: Zylinder [dpt]</label>
  <select id="cylinderSelect" onChange={(e) => setSelectedCylinder(e.target.value)} value={selectedCylinder}>
    <option value="">Bitte auswählen</option>
    {uniqueCylinders.map((value, index) => (
      <option key={`cylinder-${index}`} value={value}>{value}</option>
    ))}
  </select>
  {selectedTable && (
    <div>
      <label className="result-label">Ergebnis: Lentikeldicke [µm]</label>
      <input 
        type="text" 
        id="result" 
        name="result" 
        value={(selectedSphere === "0" && selectedCylinder === "0") ||
        (selectedSphere === "0" && selectedCylinder === "-0.25") ||
        (selectedSphere === "0" && selectedCylinder === "-0.5") ||
        (selectedSphere === "0" && selectedCylinder === "-0.75") ||
        (selectedSphere === "0" && selectedCylinder === "-1") ||
        (selectedSphere === "0" && selectedCylinder === "-1.25") ||
        (selectedSphere === "-0.25" && selectedCylinder === "0") ||
        (selectedSphere === "-0.25" && selectedCylinder === "-0.25") ||
        (selectedSphere === "-0.25" && selectedCylinder === "-0.5") ||
        (selectedSphere === "-0.25" && selectedCylinder === "-0.75") ||
        (selectedSphere === "-0.5" && selectedCylinder === "0") ||
        (selectedSphere === "-0.5" && selectedCylinder === "-0.25")
        ? "SMILE nicht möglich" : Math.round(sum * 1.1)} 
        readOnly 
        className="result-display" 
      />
    </div>
  )}
</div>
      </form>
      {sum && ( // Only show this section if a sum has been calculated
       <form onSubmit={handleFinalCalculation}>
       <div className="form-section">
         <h2 className="subtitle">Hornhautdicke</h2>
         <label htmlFor="userInput">Bitte eintragen: Ergebnis Pachymetrie aus Pentacam [µm]</label>
         <input
           type="number"
           id="userInput"
           value={userInput}
           placeholder='Bitte eintragen'
           onChange={handleUserInputChange}
           className="result-display"
         />
     
         {/*<label htmlFor="constantValue">Cap-Dicke [µm]</label>
         <input type="text" value="120" readOnly className="bordered-value" />
        <p>Standard zur Berechnung prä OP: 120 µm – Anpassung pär/intra OP durch Operateur möglich (z.B. 110 µm)</p>*/}
       </div>
     
  <button type="submit">Stromale Restdicke berechnen</button>
{finalResult !== '' && (
    <div className="form-section output-section">
        <h2 htmlFor="finalResult" className="subtitle">Ergebnis: Stromale Restdicke [µm]</h2>
        <input type="text"  
               id="finalResult" 
               value={
                (selectedSphere === "0" && selectedCylinder === "0") ||
                (selectedSphere === "0" && selectedCylinder === "-0.25") ||
                (selectedSphere === "0" && selectedCylinder === "-0.5") ||
                (selectedSphere === "0" && selectedCylinder === "-0.75") ||
                (selectedSphere === "0" && selectedCylinder === "-1") ||
                (selectedSphere === "0" && selectedCylinder === "-1.25") ||
                (selectedSphere === "-0.25" && selectedCylinder === "0") ||
                (selectedSphere === "-0.25" && selectedCylinder === "-0.25") ||
                (selectedSphere === "-0.25" && selectedCylinder === "-0.5") ||
                (selectedSphere === "-0.25" && selectedCylinder === "-0.75") ||
                (selectedSphere === "-0.5" && selectedCylinder === "0") ||
                (selectedSphere === "-0.5" && selectedCylinder === "-0.25")
                ? "SMILE nicht möglich"
                : finalResult
              }
               readOnly 
               className={`result-display ${finalResult < 280 ? 'result-red' : ''}`}
        />
         <div>
        <span className="minimum-alert">Übliches Minimum: 280 µm</span>
      </div>
      <div>
        {finalResult < 260 && finalResult !== '' && (
          <div className="error-message">Achtung! Gegebenenfalls nicht ausreichend</div>
        )}
      </div>
    </div>
)}
</form>

        )}
      <footer className="app-footer">
  <p>Hinweise: Die Kalkulation basiert auf einer optischen Zone von 6,3 mm und einer Cap-Dicke von 120 µm. Dieses Tool berücksichtigt den Aufschlag auf Sphäre und Zylinder aus der SRF bei Eingabe in den Visumax (ca. 10 % Aufschlag). Ein Reststroma-Puffer von ca. 30 µm für eine Re-OP ist bereits berücksichtigt.</p>
</footer>
<footer className="app-footer-two">
  <p>&copy; Smile Eyes</p>
</footer>
</>
  )}
  </div>
);
}

export default App;
