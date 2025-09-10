import { Outlet } from "react-router-dom";
import { FullScreenButton } from "../../../components/FullScreenButton";
import './styles.css';

export function InitialMenuLayout() {
    return (
        <div className="wrapperHome">
            <div className="container">
                <div className="fullscreen-button-container">
                    <FullScreenButton />
                </div>
                <div>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}