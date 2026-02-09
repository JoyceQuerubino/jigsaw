import { Slider } from "../../components/slider/slider";
import { useGetGames } from "../../hooks/useGetGames";
import "./theme-screen.css";

export function ThemeScreen() {
  const { data } = useGetGames();

  return (
    <>
      {data && (
        <div className="theme-container">
          <Slider cardsData={data} goConfig largeCardsOnWideScreen />
        </div>
      )}
    </>
  );
}
