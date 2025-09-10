import { Alignment, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { useDeviceOrientation } from "../../hooks/useDeviceOrientation";

export interface RacconAnimationProps {
  initialState: number, 
}

export const RaccoonHome = ({initialState}: RacconAnimationProps) => {
  const STATE_MACHINE_NAME = "State Machine 1";
  const STATE_MACHINE_INPUT_NAME = "Number 1";
  const [flameRateValue, setFlameRateValue] = useState(1);
  const { isMobile } = useDeviceOrientation();

  const { RiveComponent, rive } = useRive({
    src: "/guaxinim.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    useOffscreenRenderer: true, 
  });

  const flameRateInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    STATE_MACHINE_INPUT_NAME
  );

  useEffect(() => {
    if (flameRateInput) {
      console.log('Setting flameRateInput.value to:', flameRateValue);
      flameRateInput.value = flameRateValue;
    }
  }, [flameRateValue, flameRateInput]);

  useEffect(() => {
    if (flameRateInput && flameRateValue !== initialState) {
      console.log('Forcing initial state after input is ready:', initialState);
      setFlameRateValue(initialState);
    }
  }, [flameRateInput, initialState]);

  const containerStyle = (isMobile) 
    ? { width: 742, height: 310, paddingTop: '20px', }
    : { width: 842, height: 410 };

  return (
    <div style={containerStyle}>
      <RiveComponent 
        style={{ 
          paddingTop: 20,
          width: isMobile ? 322 : 472, 
          height: isMobile ? 310 : 410, 
          backgroundColor: "transparent",
          mixBlendMode: "multiply",
        }} 
      />
    </div>
  );
};
