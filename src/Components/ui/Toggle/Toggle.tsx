import React from "react";
import "./Toggle.scss";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  onBlur?: () => void;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  label,
  size = "md",
  onBlur,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
      if (onBlur) {
        onBlur();
      }
    }
  };

  return (
    <div className="toggle-wrapper">
      {label && (
        <label htmlFor={id} className="toggle-label">
          {label}
        </label>
      )}
      <div
        className={`toggle-switch ${size} ${checked ? "checked" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleToggle}
        id={id}
      >
        <div className="toggle-slider"></div>
      </div>
    </div>
  );
};

export default Toggle;
