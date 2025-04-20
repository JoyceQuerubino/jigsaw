import { Outlet, useMatches } from "react-router-dom";
import './styles.css';
import { Header } from "../../../components/Header/header";

interface RouteHandle {
    title?: string;
    isMenu?: boolean;
}

export function GameLayout() {
    const matches = useMatches();
    const lastMatch = matches[matches.length - 1];
    const { title, isMenu = false } = (lastMatch.handle as RouteHandle) || {};

    return (
        <div className="wrapper">
            <div className="game-container">
                <Header title={title} isMenu={isMenu} />
                <div className="content-container">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}