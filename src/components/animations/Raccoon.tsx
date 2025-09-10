import { Alignment, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";

export interface RacconAnimationProps {
  initialState: number, 
  animationNumber?: number;
}

export const Raccoon = ({initialState = 0, animationNumber = 2}: RacconAnimationProps) => {
  // Name of the State Machine for this animation
  const STATE_MACHINE_NAME = "State Machine 1";
  const STATE_MACHINE_INPUT_NAME = "Number 1";
  const [flameRateValue, setFlameRateValue] = useState(0);

  const { RiveComponent, rive } = useRive({
    src: "/src/assets/guaxinim.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    useOffscreenRenderer: true, 
    onStateChange: (e) => {
      console.log('State change event:', e.data);
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
      console.log('Setting flameRateInput.value to:', flameRateValue);
      flameRateInput.value = flameRateValue;
    }
  }, [flameRateValue, flameRateInput]);

  // Garantir que o estado inicial seja aplicado quando o input estiver disponível
  // useEffect(() => {
  //   if (flameRateInput && flameRateValue !== initialState) {
  //     console.log('Forcing initial state after input is ready:', initialState);
  //     setFlameRateValue(initialState);
  //   }
  // }, [flameRateInput, initialState]);

  return (
    <div style={{ width: 842, height: 410}}>
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
