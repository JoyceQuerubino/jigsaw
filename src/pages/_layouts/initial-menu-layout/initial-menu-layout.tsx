import { Outlet } from "react-router-dom";
import './styles.css';

export function InitialMenuLayout() {
    return (
        <div className="container">
            <div>
                <Outlet/>
            </div>
        </div>
    )
}