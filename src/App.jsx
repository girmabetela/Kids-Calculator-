import { useState } from "react";

const FACES = ["😀", "😺", "🦄", "🐸", "🐼", "🦊", "🐵", "🐨"];

function pickFace() {
  return FACES[Math.floor(Math.random() * FACES.length)];
}

function factorial(n) {
  if (n < 0 || !Number.isFinite(n)) return NaN;
  if (n > 170) return Infinity;

  let result = 1;
  for (let i = 2; i <= Math.floor(n); i++) {
    result *= i;
  }
  return result;
}

function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";

  const rounded = Math.abs(value) < 1e-12 ? 0 : value;

  if (Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9) {
    return rounded.toExponential(8).replace(/\.?0+e/, "e");
  }

  return Number(rounded.toFixed(10)).toString();
}

export default function KidsCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [face, setFace] = useState("😀");
  const [burst, setBurst] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [angleMode, setAngleMode] = useState("DEG");
  const [justCalculated, setJustCalculated] = useState(false);

  const pop = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 350);
  };

  const getNumber = () => {
    const value = parseFloat(display);
    return Number.isFinite(value) ? value : NaN;
  };

  const inputNumber = (n) => {
    pop();

    if (justCalculated) {
      setDisplay(n);
      setExpression("");
      setJustCalculated(false);
      return;
    }

    if (n === "." && display.includes(".")) return;

    if (display === "0" && n !== ".") {
      setDisplay(n);
    } else if (display.length < 14) {
      setDisplay(display + n);
    }
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setJustCalculated(false);
    setFace("😀");
  };

  const backspace = () => {
    if (justCalculated) {
      setDisplay("0");
      setExpression("");
      setJustCalculated(false);
      return;
    }

    if (display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const insertConstant = (value, label) => {
    pop();

    if (justCalculated) {
      setExpression("");
      setJustCalculated(false);
    }

    setDisplay(formatResult(value));
    setExpression(label);
  };

  const calculateUnary = (type) => {
    pop();
    setFace(pickFace());

    const x = getNumber();

    if (!Number.isFinite(x)) {
      setDisplay("Error");
      return;
    }

    let result;
    let label = "";

    switch (type) {
      case "sin": {
        const radians =
          angleMode === "DEG" ? (x * Math.PI) / 180 : x;
        result = Math.sin(radians);
        label = `sin(${display})`;
        break;
      }

      case "cos": {
        const radians =
          angleMode === "DEG" ? (x * Math.PI) / 180 : x;
        result = Math.cos(radians);
        label = `cos(${display})`;
        break;
      }

      case "tan": {
        const radians =
          angleMode === "DEG" ? (x * Math.PI) / 180 : x;
        result = Math.tan(radians);
        label = `tan(${display})`;
        break;
      }

      case "asin":
        if (x < -1 || x > 1) result = NaN;
        else {
          result = Math.asin(x);
          if (angleMode === "DEG") {
            result = (result * 180) / Math.PI;
          }
        }
        label = `sin⁻¹(${display})`;
        break;

      case "acos":
        if (x < -1 || x > 1) result = NaN;
        else {
          result = Math.acos(x);
          if (angleMode === "DEG") {
            result = (result * 180) / Math.PI;
          }
        }
        label = `cos⁻¹(${display})`;
        break;

      case "atan":
        result = Math.atan(x);
        if (angleMode === "DEG") {
          result = (result * 180) / Math.PI;
        }
        label = `tan⁻¹(${display})`;
        break;

      case "sqrt":
        result = x < 0 ? NaN : Math.sqrt(x);
        label = `√(${display})`;
        break;

      case "square":
        result = x * x;
        label = `(${display})²`;
        break;

      case "inverse":
        result = x === 0 ? NaN : 1 / x;
        label = `1/(${display})`;
        break;

      case "ln":
        result = x <= 0 ? NaN : Math.log(x);
        label = `ln(${display})`;
        break;

      case "log":
        result = x <= 0 ? NaN : Math.log10(x);
        label = `log(${display})`;
        break;

      case "exp":
        result = Math.exp(x);
        label = `e^(${display})`;
        break;

      case "factorial":
        result = factorial(x);
        label = `(${display})!`;
        break;

      case "percent":
        result = x / 100;
        label = `${display}%`;
        break;

      case "negate":
        result = -x;
        label = `−(${display})`;
        break;

      default:
        return;
    }

    setDisplay(formatResult(result));
    setExpression(label);
    setJustCalculated(true);
  };

  const binaryOperation = (operator) => {
    pop();

    const current = getNumber();

    if (!Number.isFinite(current)) {
      setDisplay("Error");
      return;
    }

    setExpression(`${display} ${operator}`);
    setDisplay("0");
    setJustCalculated(false);
  };

  const evaluateSimpleExpression = () => {
    const match = expression.match(
      /^(-?\d+(?:\.\d+)?)\s*([+−×÷^])$/
    );

    if (!match) return null;

    const first = parseFloat(match[1]);
    const operator = match[2];
    const second = getNumber();

    if (!Number.isFinite(first) || !Number.isFinite(second)) {
      return null;
    }

    let result;

    switch (operator) {
      case "+":
        result = first + second;
        break;

      case "−":
        result = first - second;
        break;

      case "×":
        result = first * second;
        break;

      case "÷":
        result = second === 0 ? NaN : first / second;
        break;

      case "^":
        result = Math.pow(first, second);
        break;

      default:
        return null;
    }

    return result;
  };

  const equals = () => {
    pop();
    setFace("🎉");

    const result = evaluateSimpleExpression();

    if (result === null) return;

    setDisplay(formatResult(result));
    setExpression("");
    setJustCalculated(true);

    setTimeout(() => {
      setFace(pickFace());
    }, 900);
  };

  const addParenthesis = (symbol) => {
    pop();

    if (symbol === "(") {
      if (display === "0" || justCalculated) {
        setDisplay("(");
      } else {
        setDisplay(display + "(");
      }
    } else {
      setDisplay(display + ")");
    }

    setJustCalculated(false);
  };

  const pressBasic = (key) => {
    if (/^\d$/.test(key)) {
      inputNumber(key);
      return;
    }

    if (key === ".") {
      inputNumber(".");
      return;
    }

    if (["+", "−", "×", "÷", "^"].includes(key)) {
      binaryOperation(key);
      return;
    }

    if (key === "=") {
      equals();
    }
  };

  const basicButtons = [
    ["7", "num"],
    ["8", "num"],
    ["9", "num"],
    ["÷", "op"],
    ["4", "num"],
    ["5", "num"],
    ["6", "num"],
    ["×", "op"],
    ["1", "num"],
    ["2", "num"],
    ["3", "num"],
    ["−", "op"],
    ["0", "num"],
    [".", "num"],
    ["=", "eq"],
    ["+", "op"],
  ];

  const scientificButtons = [
    ["sin", "func"],
    ["cos", "func"],
    ["tan", "func"],
    ["√", "func"],

    ["sin⁻¹", "func"],
    ["cos⁻¹", "func"],
    ["tan⁻¹", "func"],
    ["x²", "func"],

    ["ln", "func"],
    ["log", "func"],
    ["eˣ", "func"],
    ["xʸ", "op"],

    ["π", "const"],
    ["e", "const"],
    ["1/x", "func"],
    ["!", "func"],

    ["(", "paren"],
    [")", "paren"],
    ["%", "func"],
    ["=", "eq"],

    ["7", "num"],
    ["8", "num"],
    ["9", "num"],
    ["÷", "op"],

    ["4", "num"],
    ["5", "num"],
    ["6", "num"],
    ["×", "op"],

    ["1", "num"],
    ["2", "num"],
    ["3", "num"],
    ["−", "op"],

    ["0", "num"],
    [".", "num"],
    ["±", "func"],
    ["+", "op"],
  ];

  const handleScientific = (key) => {
    switch (key) {
      case "sin":
        calculateUnary("sin");
        break;
      case "cos":
        calculateUnary("cos");
        break;
      case "tan":
        calculateUnary("tan");
        break;
      case "sin⁻¹":
        calculateUnary("asin");
        break;
      case "cos⁻¹":
        calculateUnary("acos");
        break;
      case "tan⁻¹":
        calculateUnary("atan");
        break;
      case "√":
        calculateUnary("sqrt");
        break;
      case "x²":
        calculateUnary("square");
        break;
      case "ln":
        calculateUnary("ln");
        break;
      case "log":
        calculateUnary("log");
        break;
      case "eˣ":
        calculateUnary("exp");
        break;
      case "1/x":
        calculateUnary("inverse");
        break;
      case "!":
        calculateUnary("factorial");
        break;
      case "%":
        calculateUnary("percent");
        break;
      case "±":
        calculateUnary("negate");
        break;
      case "π":
        insertConstant(Math.PI, "π");
        break;
      case "e":
        insertConstant(Math.E, "e");
        break;
      case "(":
      case ")":
        addParenthesis(key);
        break;
      case "xʸ":
        binaryOperation("^");
        break;
      default:
        pressBasic(key);
    }
  };

  const getButtonStyle = (type, label) => {
    const isNum = type === "num";
    const isEq = type === "eq";

    const opColor = {
      "+": "#FF7A59",
      "−": "#4EC5D4",
      "×": "#B084F5",
      "÷": "#FFC24B",
      "^": "#B084F5",
    };

    let background = "#FFFFFF";
    let color = "#7A3B1E";
    let shadow = "#F0D8B8";

    if (isEq) {
      background = "#3FC97A";
      color = "#FFFFFF";
      shadow = "#2E9E5E";
    } else if (type === "op") {
      background = opColor[label] || "#B084F5";
      color = "#FFFFFF";
      shadow = "rgba(0,0,0,0.2)";
    } else if (type === "func") {
      background = "#E8D9FF";
      color = "#633C91";
      shadow = "#C6A7E8";
    } else if (type === "const") {
      background = "#FFE0F0";
      color = "#A33E6E";
      shadow = "#E8B5CD";
    } else if (type === "paren") {
      background = "#D8F5E5";
      color = "#27734A";
      shadow = "#AAD8BF";
    }

    return {
      padding: scientific ? "11px 2px" : "16px 0",
      borderRadius: "16px",
      border: isNum ? "2px solid #FFE3B3" : "none",
      background,
      color,
      fontWeight: 800,
      fontSize: scientific ? "15px" : "20px",
      cursor: "pointer",
      boxShadow: `0 4px 0 ${shadow}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: scientific ? "43px" : "58px",
    };
  };

  const buttons = scientific ? scientificButtons : basicButtons;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(160deg, #FFE9A8 0%, #FFCF6B 30%, #FF9F6E 65%, #FF7A9C 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Baloo 2', 'Comic Sans MS', 'Trebuchet MS', system-ui, sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap');

        @keyframes pop {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.5) rotate(-10deg);
            opacity: 0;
          }
          60% {
            transform: scale(1.15) rotate(6deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        .kc-btn:active {
          animation: pop 0.15s ease;
        }

        .kc-face {
          animation: bounceIn 0.35s ease;
        }
      `}</style>

      <div
        style={{
          width: scientific ? "min(440px, 100%)" : "min(360px, 100%)",
          maxHeight: "95vh",
          overflowY: "auto",
          background: "#FFF8EC",
          borderRadius: "32px",
          padding: "20px",
          boxShadow:
            "0 20px 0 rgba(120, 60, 20, 0.15), 0 25px 40px rgba(120, 60, 20, 0.25)",
          border: "6px solid #FFFFFF",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#8A4B2A",
            }}
          >
            Fun Math! 🧮
          </h1>

          <div key={face} className="kc-face" style={{ fontSize: "34px" }}>
            {face}
          </div>
        </div>

        {/* Mode controls */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => setScientific(!scientific)}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "10px",
              background: scientific ? "#B084F5" : "#FF9F6E",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {scientific ? "🔬 Scientific" : "🔢 Basic"}
          </button>

          <button
            onClick={() =>
              setAngleMode(angleMode === "DEG" ? "RAD" : "DEG")
            }
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "10px",
              background: "#4EC5D4",
              color: "#FFFFFF",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {angleMode} 📐
          </button>
        </div>

        {/* Display */}
        <div
          style={{
            background: "#FFE3B3",
            borderRadius: "20px",
            padding: "14px 18px",
            marginBottom: "12px",
            textAlign: "right",
            border: "3px solid #FFD08A",
            minHeight: "72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#B57B4A",
              fontWeight: 600,
              minHeight: "16px",
            }}
          >
            {expression || "\u00A0"}
          </div>

          <div
            style={{
              fontSize:
                display.length > 10
                  ? "27px"
                  : display.length > 6
                  ? "33px"
                  : "42px",
              fontWeight: 800,
              color: "#7A3B1E",
              wordBreak: "break-all",
            }}
          >
            {display}
          </div>
        </div>

        {/* Clear / Back */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <button
            className="kc-btn"
            onClick={clear}
            style={{
              padding: "12px",
              borderRadius: "16px",
              border: "none",
              background: "#FF6B6B",
              color: "#fff",
              fontWeight: 800,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 0 #C94B4B",
            }}
          >
            🧽 Clear
          </button>

          <button
            className="kc-btn"
            onClick={backspace}
            style={{
              padding: "12px",
              borderRadius: "16px",
              border: "none",
              background: "#6BB8FF",
              color: "#fff",
              fontWeight: 800,
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 0 #4A8FC9",
            }}
          >
            ⬅️ Back
          </button>
        </div>

        {/* Scientific / Basic keypad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
          }}
        >
          {buttons.map(([label, type]) => (
            <button
              key={label}
              className="kc-btn"
              onClick={() =>
                scientific ? handleScientific(label) : pressBasic(label)
              }
              style={getButtonStyle(type, label)}
            >
              {label}
            </button>
          ))}
        </div>

        {burst && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
    );
}

