import { Alignment, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";

export const Raccoon = () => {
  // Name of the State Machine for this animation
  const STATE_MACHINE_NAME = "State Machine 1";
  // Name of the input used in the state machine to trigger states
  const STATE_MACHINE_INPUT_NAME = "Number 1";
  const [flameRateValue, setFlameRateValue] = useState(0);

  const { RiveComponent, rive } = useRive({
    src: "/src/assets/guaxinim.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({ fit: Fit.None, alignment: Alignment.Center }),
  
    useOffscreenRenderer: true, 
    onStateChange: (e) => {
      if(e.data[0] === 'ide'){
        setFlameRateValue(0)
      }
    }
  });

  const flameRateInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    STATE_MACHINE_INPUT_NAME
  );

  useEffect(() => {
    if (flameRateInput) {
      flameRateInput.value = flameRateValue;
    }
  }, [flameRateValue, flameRateInput]);

  return (
    <div style={{ width: 712, height: 280}}>
      <RiveComponent 
        style={{ 
          backgroundColor: "transparent",
          mixBlendMode: "multiply",
        }} 
      />
      <button className="button" onClick={() => setFlameRateValue(2)}>
        BBB
      </button>
    </div>
  );
};
