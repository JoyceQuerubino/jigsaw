import React from "react";
import "./styles.css";
import { Slider } from "../../components/slider/slider";
import { useGetGames } from "../../hooks/useGetGames";

export function ThemeScreen() {
  const { data, isLoading } = useGetGames();

  return (
    <>
      {data && (
        <div className="theme-container">
          <Slider cardsData={data} goConfig />
        </div>
      )}
    </>
  );
}
