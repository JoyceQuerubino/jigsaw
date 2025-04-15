import "./styles.css";
import { useNavigate, useMatches } from 'react-router-dom';
import { GameTimer } from '../GameTimer/GameTimer';
import { SoundButton } from '../SoundButton/SoundButton';

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
            <img src="/src/assets/images/btn-menu.png" alt="Menu" />
          </button>
        ) : (
          <button className="header-button" onClick={handleReturn}>
            <img src="/src/assets/images/btn-return.png" alt="Botão de voltar" />
          </button>
        )}
        {title && <h1 className="header-title">{title}</h1>}
      </div>

      {isGame && <div className="header-right">
        <GameTimer isComplete={false} />
        <SoundButton />
      </div>}
    </header>
  );
}
