import "./styles.css";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  isMenu?: boolean;
}

export function Header({ title, isMenu }: HeaderProps) {
  const navigate = useNavigate();

  const handleMenu = () => {
    navigate('/');
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <header className="header-container">
      {isMenu ? (
        <button className="header-button" onClick={handleMenu}>
          <img src="/src/assets/images/btn-menu.png" alt="Menu" />
        </button>
      ) : (
        <button className="header-button" onClick={handleReturn}>
          <img src="/src/assets/images/btn-return.png" alt="Botão de voltar" />
        </button>
      )}

      <h1 className="header-title">{title}</h1>
    </header>
  );
}
