import { v4 as uuidv4 } from "uuid";
import { GameType } from "../types";

import school from "../../assets/images/school.jpg";
import alimentacao from "../../assets/images/alimentacao.jpg";
import higiene from "../../assets/images/higiene.jpg";

export const defaultGames: GameType[] = [
  {
    id: uuidv4(),
    title: "Escola",
    type: 'Quebra-cabeça',
    image: school,
    isDefault: true,
  },
  {
    id: uuidv4(),
    title: "Alimentação",
    type: 'Quebra-cabeça',
    image: alimentacao,
    isDefault: true,
  },
  {
    id: uuidv4(),
    title: "Higiene",
    type: 'Quebra-cabeça',
    image: higiene,
    isDefault: true,
  },
];
