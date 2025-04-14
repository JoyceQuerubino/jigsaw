import "./Input.css";
import inputBg from "../../assets/images/input.png";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function Input({ label, placeholder, value, onChange }: InputProps) {
  return (
    <div className="input-texts-container">
      <p>{label}</p>
      <div className="input-container">
        <img src={inputBg} alt="Input background" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
} 