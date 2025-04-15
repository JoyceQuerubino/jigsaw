import "./App.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { GameProvider } from "./contexts/GameContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
