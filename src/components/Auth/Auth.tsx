import React, { useState } from "react";
import "./auth.scss";

type authConfig = {
  defaultValue: string;
  valid: string;
};

interface IAuthProps {
  config: authConfig;
  onChangeHandlerValue: (e: boolean) => void;
}

const Auth = ({ config, onChangeHandlerValue }: IAuthProps) => {
  const [slideValue, setSlideValue] = useState<any>();

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlideValue(e.target.value);
    console.log(e.target.value?.toString() === config.valid);
    onChangeHandlerValue(
      e.target.value?.toString() === config.valid.toString()
    );
  };

  return (
    <div className="auth-container">
      <div
        className="child-auth-silders vertical-slider"
        key={config.defaultValue}
      >
        <div className="slider-wrapper">
          <input
            className="my-slider-face vertical"
            name="slider"
            type="range"
            value={slideValue}
            defaultValue={config.defaultValue}
            onChange={handleSlider}
            min="0"
            max="100"
          />
        </div>
      </div>
      <span className="slider-value">{slideValue}</span>
    </div>
  );
};

export default Auth;
