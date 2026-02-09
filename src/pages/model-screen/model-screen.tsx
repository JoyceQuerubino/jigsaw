import "./styles.css";
import { Slider } from "../../components/slider/slider";
import constructionImage from "../../assets/images/games/construction.png"
import elephant from "../../assets/images/games/jgsaw-game.png";

const cardsData = [
    {
      id: "1",
      title: "Quebra-cabeças",
      image: elephant,
    },
    {
      id: "2",
      title: "Em construção",
      image: constructionImage,
      disabled: true,
    },
    {
      id: "3",
      title: "Em construção",
      image: constructionImage,
      disabled: true,
    },
  ];

export function ModelScreen() {
  return (
    <div className="model-container">
        <Slider cardsData={cardsData} goConfig={false} largeCardsOnWideScreen />
    </div>
  );
}