import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Game } from "./pages/game/game";
import { GameLayout } from "./pages/_layouts/game-layout/game-layout";
import { ModelScreen } from "./pages/model-screen/model-screen";
import { ThemeScreen } from "./pages/theme-screen/theme-screen";
import { ConfigScreen } from "./pages/config-screen/config-screen";
import { InitialMenuLayout } from "./pages/_layouts/initial-menu-layout/initial-menu-layout";
import { MyGames } from "./pages/my-games/my-games";
import { NewGame } from "./pages/new-game/new-game";
import { Tutorial } from "./pages/tutorial/tutorial";
import { Credits } from "./pages/credits/credits";

export const router = createBrowserRouter([
    {   
        path: '/', 
        element: <InitialMenuLayout/>,
        children: [
            { 
                path: '/', 
                element: <Home/>,
            }
        ]
    },
    {   
        path: '/', 
        element: <GameLayout/>,
        children: [
            { 
                path: '/model', 
                element: <ModelScreen/>,
                handle: {
                    title: "Escolha um modelo de jogo",
                    isMenu: true
                }
                
            },
            { 
                path: '/theme', 
                element: <ThemeScreen/>,
                handle: {
                    title: "Escolha um tema",
                    isMenu: false
                }
                
            },
            { 
                path: '/config/:puzzleImage', 
                element: <ConfigScreen/>,
                handle: {
                    title: "Configurações",
                    isMenu: false
                }
            },
            { 
                path: '/game', 
                element: <Game/>,
                handle: {
                    title: "Game",
                    isMenu: false
                }
                
            }, 
            { 
                path: '/my-games', 
                element: <MyGames/>,
                handle: {
                    title: "Meus jogos",
                    isMenu: true
                }
                
            },
            { 
                path: '/new-game', 
                element: <NewGame/>,
                handle: {
                    title: "Novo Jogo",
                }
                
            }, 
            { 
                path: '/tutoriais', 
                element: <Tutorial/>,
                handle: {
                    isMenu: true
                }
                
            },
            { 
                path: '/credits', 
                element: <Credits/>,
                handle: {
                    isMenu: true
                }
                
            }
        ]
    },
])