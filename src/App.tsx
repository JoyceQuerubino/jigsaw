import "./App.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { GameProvider } from "./contexts/GameContext";
import { useDeviceOrientation } from "./hooks/useDeviceOrientation";
import { RotateDeviceWarning } from "./components/RotateDeviceWarning";

const queryClient = new QueryClient();

function App() {
  const { shouldShowRotateWarning } = useDeviceOrientation();

  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        {shouldShowRotateWarning && <RotateDeviceWarning />}
        <RouterProvider router={router} />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
