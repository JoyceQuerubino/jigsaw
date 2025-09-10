import { Alignment, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import { useDeviceOrientation } from "../../hooks/useDeviceOrientation";

export interface RacconAnimationProps {
  animationState: number, 
  setAnimationState?: (state: number) => void;
}

export const Raccoon = ({animationState, setAnimationState}: RacconAnimationProps) => {
  const STATE_MACHINE_NAME = "State Machine 1";
  const STATE_MACHINE_INPUT_NAME = "Number 1";
  const { isMobile } = useDeviceOrientation();

  const { RiveComponent, rive } = useRive({
    src: "/guaxinim.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    useOffscreenRenderer: true, 
    onStateChange: (e) => {
      if(e.data && Array.isArray(e.data) && e.data[0] === 'ide'){
        setAnimationState?.(0)
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
      console.log('Setting flameRateInput.value to:', animationState);
      flameRateInput.value = animationState;
    }
  }, [animationState, flameRateInput]);


  return (
    <div style={{ width: 300, height: 400,  flexShrink: 0,}}>
      <RiveComponent 
        style={{ 
          backgroundColor: "transparent",
          mixBlendMode: "multiply",
        }} 
      />
    </div>
  );
};
