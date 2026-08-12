import { useState } from "react";

const BUTTONS = [
{ label: "7", type: "num" },
{ label: "8", type: "num" },
{ label: "9", type: "num" },
{ label: "÷", type: "op", emoji: "🍕" },
{ label: "4", type: "num" },
{ label: "5", type: "num" },
{ label: "6", type: "num" },
{ label: "×", type: "op", emoji: "✨" },
{ label: "1", type: "num" },
{ label: "2", type: "num" },
{ label: "3", type: "num" },
{ label: "−", type: "op", emoji: "🐢" },
{ label: "0", type: "num" },
{ label: ".", type: "num" },
{ label: "=", type: "eq", emoji: "🎉" },
{ label: "+", type: "op", emoji: "🚀" },
];

const FACES = ["😀", "😺", "🦄", "🐸", "🐼", "🦊", "🐵", "🐨"];

function pickFace() {
return FACES[Math.floor(Math.random() * FACES.length)];
}

export default function KidsCalculator() {
const [display, setDisplay] = useState("0");
const [prev, setPrev] = useState(null);
const [op, setOp] = useState(null);
const [overwrite, setOverwrite] = useState(true);
const [face, setFace] = useState("😀");
const [burst, setBurst] = useState(false);

const pop = () => {
setBurst(true);
setTimeout(() => setBurst(false), 350);
};

const inputNum = (n) => {
pop();
if (n === "." && display.includes(".")) return;
if (overwrite) {
setDisplay(n === "." ? "0." : n);
setOverwrite(false);
} else {
if (display.length >= 9) return;
setDisplay(display === "0" && n !== "." ? n : display + n);
}
};

const compute = (a, b, operator) => {
const x = parseFloat(a);
const y = parseFloat(b);
switch (operator) {
case "+":
return x + y;
case "−":
return x - y;
case "×":
return x * y;
case "÷":
return y === 0 ? "Oops!" : x / y;
default:
return y;
}
};

const chooseOp = (nextOp) => {
pop();
setFace(pickFace());
if (prev !== null && op && !overwrite) {
const result = compute(prev, display, op);
setDisplay(String(result));
setPrev(result === "Oops!" ? null : String(result));
} else {
setPrev(display);
}
setOp(nextOp);
setOverwrite(true);
};

const equals = () => {
pop();
setFace("🎉");
if (prev === null || op === null) return;
const result = compute(prev, display, op);
setDisplay(String(result));
setPrev(null);
setOp(null);
setOverwrite(true);
setTimeout(() => setFace(pickFace()), 900);
};

const clear = () => {
setDisplay("0");
setPrev(null);
setOp(null);
setOverwrite(true);
setFace("😀");
};

const backspace = () => {
if (overwrite) return;
const next = display.length > 1 ? display.slice(0, -1) : "0";
setDisplay(next);
if (next === "0") setOverwrite(true);
};

const press = (btn) => {
if (btn.type === "num") inputNum(btn.label);
else if (btn.type === "op") chooseOp(btn.label);
else equals();
};

const opColor = {
"+": "#FF7A59",
"−": "#4EC5D4",
"×": "#B084F5",
"÷": "#FFC24B",
};

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
<style>{  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap');   @keyframes pop {   0% { transform: scale(1); }   40% { transform: scale(0.92); }   100% { transform: scale(1); }   }   @keyframes bounceIn {   0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }   60% { transform: scale(1.15) rotate(6deg); opacity: 1; }   100% { transform: scale(1) rotate(0deg); }   }   .kc-btn:active { animation: pop 0.15s ease; }   .kc-face { animation: bounceIn 0.35s ease; }  }</style>

<div  
    style={{  
      width: "min(360px, 100%)",  
      background: "#FFF8EC",  
      borderRadius: "32px",  
      padding: "20px",  
      boxShadow:  
        "0 20px 0 rgba(120, 60, 20, 0.15), 0 25px 40px rgba(120, 60, 20, 0.25)",  
      border: "6px solid #FFFFFF",  
    }}  
  >  
    {/* Header */}  
    <div  
      style={{  
        display: "flex",  
        alignItems: "center",  
        justifyContent: "space-between",  
        marginBottom: "14px",  
      }}  
    >  
      <h1  
        style={{  
          margin: 0,  
          fontSize: "22px",  
          fontWeight: 800,  
          color: "#8A4B2A",  
          letterSpacing: "0.5px",  
        }}  
      >  
        Fun Math! 🧮  
      </h1>  
      <div key={face} className="kc-face" style={{ fontSize: "34px" }}>  
        {face}  
      </div>  
    </div>  

    {/* Display */}  
    <div  
      style={{  
        background: "#FFE3B3",  
        borderRadius: "20px",  
        padding: "18px 20px",  
        marginBottom: "16px",  
        textAlign: "right",  
        border: "3px solid #FFD08A",  
        minHeight: "34px",  
        display: "flex",  
        flexDirection: "column",  
        justifyContent: "flex-end",  
      }}  
    >  
      <div  
        style={{  
          fontSize: "13px",  
          color: "#B57B4A",  
          fontWeight: 600,  
          minHeight: "16px",  
        }}  
      >  
        {prev !== null ? `${prev} ${op ?? ""}` : "\u00A0"}  
      </div>  
      <div  
        style={{  
          fontSize: display.length > 6 ? "32px" : "44px",  
          fontWeight: 800,  
          color: "#7A3B1E",  
          wordBreak: "break-all",  
          transition: "font-size 0.15s ease",  
        }}  
      >  
        {display}  
      </div>  
    </div>  

    {/* Clear / Backspace row */}  
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
          padding: "14px",  
          borderRadius: "16px",  
          border: "none",  
          background: "#FF6B6B",  
          color: "#fff",  
          fontWeight: 800,  
          fontSize: "16px",  
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
          padding: "14px",  
          borderRadius: "16px",  
          border: "none",  
          background: "#6BB8FF",  
          color: "#fff",  
          fontWeight: 800,  
          fontSize: "16px",  
          cursor: "pointer",  
          boxShadow: "0 4px 0 #4A8FC9",  
        }}  
      >  
        ⬅️ Back  
      </button>  
    </div>  

    {/* Keypad */}  
    <div  
      style={{  
        display: "grid",  
        gridTemplateColumns: "repeat(4, 1fr)",  
        gap: "10px",  
        position: "relative",  
      }}  
    >  
      {BUTTONS.map((btn) => {  
        const isNum = btn.type === "num";  
        const isEq = btn.type === "eq";  
        const bg = isNum  
          ? "#FFFFFF"  
          : isEq  
          ? "#3FC97A"  
          : opColor[btn.label];  
        const color = isNum ? "#7A3B1E" : "#FFFFFF";  
        const shadow = isNum  
          ? "#F0D8B8"  
          : isEq  
          ? "#2E9E5E"  
          : "rgba(0,0,0,0.2)";  
        return (  
          <button  
            key={btn.label}  
            className="kc-btn"  
            onClick={() => press(btn)}  
            style={{  
              padding: "16px 0",  
              borderRadius: "16px",  
              border: isNum ? "2px solid #FFE3B3" : "none",  
              background: bg,  
              color,  
              fontWeight: 800,  
              fontSize: "20px",  
              cursor: "pointer",  
              boxShadow: `0 4px 0 ${shadow}`,  
              display: "flex",  
              flexDirection: "column",  
              alignItems: "center",  
              gap: "2px",  
            }}  
          >  
            <span>{btn.label}</span>  
            {btn.emoji && (  
              <span style={{ fontSize: "13px" }}>{btn.emoji}</span>  
            )}  
          </button>  
        );  
      })}  
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
