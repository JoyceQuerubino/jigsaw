import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import './styles.css';
import { Header } from "../../../components/Header/header";

interface RouteHandle {
    title?: string;
    isMenu?: boolean;
}

export type GameLayoutOutletContext = {
    setTitleOverride: (title: string | null) => void;
};

export function GameLayout() {
    const [titleOverride, setTitleOverride] = useState<string | null>(null);
    const matches = useMatches();
    const lastMatch = matches[matches.length - 1];
    const { title, isMenu = false } = (lastMatch.handle as RouteHandle) || {};
    const displayTitle = titleOverride ?? title;

    return (
        <div className="wrapper">
            <div className="game-container">
                <Header title={displayTitle} isMenu={isMenu} />
                <div className="content-container">
                    <Outlet context={{ setTitleOverride } satisfies GameLayoutOutletContext} />
                </div>
            </div>
        </div>
    )
}