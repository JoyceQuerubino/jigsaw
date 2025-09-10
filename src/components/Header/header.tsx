import "./styles.css";
import { useNavigate, useMatches } from 'react-router-dom';
import { GameTimer } from '../GameTimer/GameTimer';
import { SoundButton } from '../SoundButton/SoundButton';
import { FullScreenButton } from '../FullScreenButton';
import { useGame } from '../../contexts/GameContext';
import menuButton from '../../assets/images/btn-menu.png';
import returnButton from '../../assets/images/btn-return.png';

interface HeaderProps {
  title?: string;
  isMenu?: boolean;
}

interface RouteHandle {
  title?: string;
  isMenu?: boolean;
  isGame?: boolean;
}

export function Header({ title, isMenu }: HeaderProps) {
  const navigate = useNavigate();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const { isGame = false } = (lastMatch.handle as RouteHandle) || {};
  const { isPuzzleComplete } = useGame();

  const handleMenu = () => {
    navigate('/');
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        {isMenu ? (
          <button className="header-button" onClick={handleMenu}>
            <img src={menuButton} alt="Menu" />
          </button>
        ) : (
          <button className="header-button" onClick={handleReturn}>
            <img src={returnButton} alt="Botão de voltar" />
          </button>
        )}
        {title && <h1 className="header-title">{title}</h1>}
      </div>

      <div className="header-right">
        {isGame && (
          <>
            <GameTimer isComplete={isPuzzleComplete} />
            <SoundButton />
          </>
        )}
        <FullScreenButton />
      </div>
    </header>
  );
}
