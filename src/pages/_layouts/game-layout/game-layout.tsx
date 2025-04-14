import { Outlet, useMatches } from "react-router-dom";
import './styles.css';
import { Header } from "../../../components/Header/header";

interface RouteHandle {
    title: string;
    isMenu: boolean;
}

export function GameLayout() {
    const matches = useMatches();
    const lastMatch = matches[matches.length - 1];
    const { title = "Jogo", isMenu = false } = (lastMatch.handle as RouteHandle) || {};

    return (
        <div className="game-container">
            <Header title={title} isMenu={isMenu} />

            <div>
                <Outlet/>
            </div>
        </div>
    )
}