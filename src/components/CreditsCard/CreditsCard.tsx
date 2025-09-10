import "./CreditsCard.css";

interface CreditsCardProps {
  children: React.ReactNode;
  title?: string;
}

export function CreditsCard({ children, title = "CRÉDITOS" }: CreditsCardProps) {
  return (
    <div className="credits-content">
      <div className="credits-header-white"></div>
      <div className="credits-header">
        <h1>{title}</h1>
      </div>
      <div className="credits-white">
        <div className="credits-brow">
          <div className="credits-yellow">
            <div className="credits-orange">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}