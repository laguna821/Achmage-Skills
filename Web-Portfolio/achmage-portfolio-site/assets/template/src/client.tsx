import {hydrateRoot} from "react-dom/client";
import PortfolioApp from "./Portfolio";
import type {Portfolio,Lang} from "./model";
const node=document.getElementById("portfolio-data");
if(!node?.textContent)throw new Error("Missing page data");
const props=JSON.parse(node.textContent) as {content:Portfolio;lang:Lang;route:string};
hydrateRoot(document.getElementById("app")!,<PortfolioApp {...props}/>);
