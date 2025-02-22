import React, { useState, useEffect } from "react";
import "./index.css";

function Navbar({ selectedPMA, setSelectedPMA }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (pma) => {
    setSelectedPMA(pma);
    setDropdownOpen(false);
  };

  const pmaOptions = [
    "PMA 01",
    "PMA 02",
    "PMA 03",
    "PMA 04",
    "PMA 05",
    "PMA 06",
    "PMA 07",
    "PMA 08",
    "PMA 09",
    "PMA 10",
  ];

  const appTitle =
    selectedPMA === "PMA 09" ? "Data Breach Severity Calculator" : "DPOC Tools";

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img
          src="https://www.dpoconsultancy.com/wp-content/uploads/2024/03/DPO_logo.svg"
          alt="DPO Consultancy Logo"
          className="logo"
        />
        <span className="app-title">{appTitle}</span>
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-button">
          {selectedPMA} ▼
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            {pmaOptions.map((option) => (
              <a key={option} onClick={() => handleSelect(option)}>
                {option}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  // Selected PMA state; default is PMA 09
  const [selectedPMA, setSelectedPMA] = useState("PMA 09");

  // DPC category (data type) and final DPC score (editable)
  const [dpcCategory, setDpcCategory] = useState("1");
  const [dpc, setDpc] = useState("1");

  // Other criteria states
  const [ei, setEi] = useState("1");
  const [confidentiality, setConfidentiality] = useState("0");
  const [integrity, setIntegrity] = useState("0");
  const [availability, setAvailability] = useState("0");
  const [malicious, setMalicious] = useState("0");
  const [result, setResult] = useState(null);

  // States for text explanations
  const [dpcText, setDpcText] = useState("");
  const [eiText, setEiText] = useState("");
  const [confText, setConfText] = useState("");
  const [integrityText, setIntegrityText] = useState("");
  const [availText, setAvailText] = useState("");
  const [maliciousText, setMaliciousText] = useState("");

  // Options for DPC and table data (from Annex A1)
  const dpcOptions = {
    1: "1 – Simple data, e.g., basic info like name and contact details.",
    2: "2 – Behavioral data, e.g., preferences, habits, or traffic data.",
    3: "3 – Financial data, e.g., bank statements, transaction details.",
    4: "4 – Sensitive data, e.g., health or political affiliation.",
  };

  const dpcTableData = {
    1: [
      { score: "1", description: "Basic score: no aggravating factors." },
      {
        score: "2",
        description:
          "Increased by 1: volume/characteristics allow profiling or assumptions about social/financial status.",
      },
      {
        score: "3",
        description:
          "Increased by 2: characteristics lead to assumptions about health, sexual preferences, political or religious beliefs.",
      },
      {
        score: "4",
        description:
          "Increased by 3: vulnerable groups/minors; data critical for personal safety.",
      },
    ],
    2: [
      {
        score: "1",
        description:
          "Decreased by 1: minimal behavioural insight; data easily collected publicly.",
      },
      { score: "2", description: "Basic score: no adjustment." },
      {
        score: "3",
        description:
          "Increased by 1: detailed profile can be created from the data.",
      },
      {
        score: "4",
        description:
          "Increased by 2: profile based on sensitive data can be created.",
      },
    ],
    3: [
      {
        score: "1",
        description:
          "Decreased by 2: minimal financial insight (e.g. only customer indicator).",
      },
      {
        score: "2",
        description:
          "Decreased by 1: some financial info but not enough for significant insight.",
      },
      { score: "3", description: "Basic score: no adjustment." },
      {
        score: "4",
        description:
          "Increased by 1: full financial details disclosed enabling fraud/detailed profiling.",
      },
    ],
    4: [
      {
        score: "1",
        description:
          "Decreased by 1: data does not provide substantial insight (e.g. public availability).",
      },
      {
        score: "2",
        description: "Decreased by 2: data can lead to general assumptions.",
      },
      {
        score: "3",
        description:
          "Decreased by 1: data can lead to assumptions about sensitive information.",
      },
      { score: "4", description: "Basic score: no lessening factors present." },
    ],
  };

  // Options for EI and other criteria
  const eiOptions = {
    0.25: "0.25 – Very difficult to identify the individual.",
    0.5: "0.5 – Identification is possible but requires effort.",
    0.75: "0.75 – Several clues make identification easier.",
    1: "1 – Individual can be directly identified.",
  };

  const confOptions = {
    0: "0 – No breach in confidentiality.",
    0.25: "0.25 – Data shared with a few known recipients.",
    0.5: "0.5 – Data shared with several recipients.",
  };

  const integrityOptions = {
    0: "0 – Data remains unaltered.",
    0.25: "0.25 – Minor alterations with easy recovery.",
    0.5: "0.5 – Data altered irrecoverably.",
  };

  const availOptions = {
    0: "0 – Data recoverable; backups or alternative sources exist.",
    0.25: "0.25 – Low availability; temporary unavailability.",
    0.5: "0.5 – High unavailability; data completely lost.",
  };

  const maliciousOptions = {
    0: "0 – No; breach appears accidental.",
    0.5: "0.5 – Yes; evidence of deliberate action.",
  };

  const handleDpcCategoryChange = (e) => {
    const selected = e.target.value;
    setDpcCategory(selected);
    setDpc(selected);
  };

  useEffect(() => {
    const dpcVal = parseFloat(dpc);
    const eiVal = parseFloat(ei);
    const confVal = parseFloat(confidentiality);
    const integrityVal = parseFloat(integrity);
    const availVal = parseFloat(availability);
    const maliciousVal = parseFloat(malicious);
    const cb = confVal + integrityVal + availVal + maliciousVal;
    const severity = dpcVal * eiVal + cb;
    let level = "";
    if (severity < 3) level = "Low";
    else if (severity < 5) level = "Medium";
    else if (severity < 7) level = "High";
    else level = "Very High";

    setResult({
      severity: severity.toFixed(2),
      level,
      dpcValue: dpc,
      eiValue: ei,
      cbValue: cb.toFixed(2),
      breakdown: {
        "Data Processing Context (DPC)": {
          option: dpc,
          score: dpc,
          description: dpcOptions[dpcCategory],
          comment: dpcText,
        },
        "Ease of Identification (EI)": {
          option: ei,
          score: ei,
          description: eiOptions[ei],
          comment: eiText,
        },
        "Loss of Confidentiality": {
          option: confidentiality,
          score: confidentiality,
          description: confOptions[confidentiality],
          comment: confText,
        },
        "Loss of Integrity": {
          option: integrity,
          score: integrity,
          description: integrityOptions[integrity],
          comment: integrityText,
        },
        "Loss of Availability": {
          option: availability,
          score: availability,
          description: availOptions[availability],
          comment: availText,
        },
        "Malicious Intent": {
          option: malicious,
          score: malicious,
          description: maliciousOptions[malicious],
          comment: maliciousText,
        },
      },
    });
  }, [
    dpc,
    dpcCategory,
    ei,
    confidentiality,
    integrity,
    availability,
    malicious,
    dpcText,
    eiText,
    confText,
    integrityText,
    availText,
    maliciousText,
  ]);

  const getRiskColor = (level) => {
    if (level === "Low") return "#28a745";
    if (level === "Medium") return "#ffc107";
    if (level === "High") return "#dc3545";
    if (level === "Very High") return "#c82333";
    return "black";
  };

  const tableRows = result
    ? Object.entries(result.breakdown).map(([key, value]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{value.option}</td>
          <td>{value.score}</td>
          <td>{value.description}</td>
          <td>{value.comment}</td>
        </tr>
      ))
    : null;

  return (
    <div className="container">
      <Navbar selectedPMA={selectedPMA} setSelectedPMA={setSelectedPMA} />
      {selectedPMA === "PMA 09" ? (
        <main className="main-content">
          <div className="form-container">
            <p>
              This framework provides a quantitative tool to assess the severity
              of a data breach. It combines various factors to generate a risk
              score that reflects the potential impact on individuals.
            </p>
            <p>
              The methodology is derived from ENISA. For more details about the
              original methodology, please{" "}
              <a
                href="https://www.enisa.europa.eu/publications/dbn-severity"
                target="_blank"
                rel="noopener noreferrer"
              >
                access the ENISA report here.
              </a>
            </p>
            <div className="section">
              <h2>Data Processing Context (DPC)</h2>
              <p>DPC represents the type of data involved in the breach.</p>
              <label className="question">Select the data type:</label>
              <div className="radio-group">
                {Object.entries(dpcOptions).map(([key, description]) => (
                  <label key={key}>
                    <input
                      type="radio"
                      name="dpcCategory"
                      value={key}
                      checked={dpcCategory === key}
                      onChange={handleDpcCategoryChange}
                    />
                    {description}
                  </label>
                ))}
              </div>
              {dpcCategory && (
                <div className="dpc-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Score</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dpcTableData[dpcCategory].map((row, index) => (
                        <tr
                          key={index}
                          className={dpc === row.score ? "selected" : ""}
                          onClick={() => setDpc(row.score)}
                        >
                          <td>{row.score}</td>
                          <td>{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="section">
              <h2>Ease of Identification (EI)</h2>
              <p>
                EI measures how easily an individual can be identified from the
                breached data.
              </p>
              <label className="question">
                Why do you assign this EI score?
              </label>
              <textarea
                value={eiText}
                onChange={(e) => setEiText(e.target.value)}
                placeholder="Type your explanation here..."
              ></textarea>
              <div className="radio-group">
                {["0.25", "0.5", "0.75", "1"].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name="ei"
                      value={score}
                      checked={ei === score}
                      onChange={(e) => setEi(e.target.value)}
                    />
                    {eiOptions[score]}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Loss of Confidentiality</h2>
              <p>This evaluates the extent of data disclosure.</p>
              <label className="question">
                Why do you assign this Confidentiality score?
              </label>
              <textarea
                value={confText}
                onChange={(e) => setConfText(e.target.value)}
                placeholder="Type your explanation here..."
              ></textarea>
              <div className="radio-group">
                {["0", "0.25", "0.5"].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name="confidentiality"
                      value={score}
                      checked={confidentiality === score}
                      onChange={(e) => setConfidentiality(e.target.value)}
                    />
                    {confOptions[score]}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Loss of Integrity</h2>
              <p>This measures if and how the data has been altered.</p>
              <label className="question">
                Why do you assign this Integrity score?
              </label>
              <textarea
                value={integrityText}
                onChange={(e) => setIntegrityText(e.target.value)}
                placeholder="Type your explanation here..."
              ></textarea>
              <div className="radio-group">
                {["0", "0.25", "0.5"].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name="integrity"
                      value={score}
                      checked={integrity === score}
                      onChange={(e) => setIntegrity(e.target.value)}
                    />
                    {integrityOptions[score]}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Loss of Availability</h2>
              <p>This examines whether data can be accessed when needed.</p>
              <label className="question">
                Why do you assign this Availability score?
              </label>
              <textarea
                value={availText}
                onChange={(e) => setAvailText(e.target.value)}
                placeholder="Type your explanation here..."
              ></textarea>
              <div className="radio-group">
                {["0", "0.25", "0.5"].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name="availability"
                      value={score}
                      checked={availability === score}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                    {availOptions[score]}
                  </label>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Malicious Intent</h2>
              <p>
                This evaluates whether the breach was accidental or intentional.
              </p>
              <label className="question">
                Why do you assign this Malicious Intent score?
              </label>
              <textarea
                value={maliciousText}
                onChange={(e) => setMaliciousText(e.target.value)}
                placeholder="Type your explanation here..."
              ></textarea>
              <div className="radio-group">
                {["0", "0.5"].map((score) => (
                  <label key={score}>
                    <input
                      type="radio"
                      name="malicious"
                      value={score}
                      checked={malicious === score}
                      onChange={(e) => setMalicious(e.target.value)}
                    />
                    {maliciousOptions[score]}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="result-container">
            {result && (
              <div className="risk-summary" id="risk-summary">
                <h2>Risk Summary</h2>
                <p className="formula">
                  Formula: SE = (DPC: {result.dpcValue}) x (EI: {result.eiValue}
                  ) + (CB: {result.cbValue})
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th>Selected Option</th>
                      <th>Score</th>
                      <th>Description</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>{tableRows}</tbody>
                </table>
                <h3>
                  Final Severity Score: {result.severity} -{" "}
                  <span style={{ color: getRiskColor(result.level) }}>
                    {result.level}
                  </span>
                </h3>
              </div>
            )}
          </div>
        </main>
      ) : (
        <p>Please select PMA 09 to use the Data Breach Severity Calculator.</p>
      )}
    </div>
  );
}

export default App;
