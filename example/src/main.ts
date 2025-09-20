import { SidebarItem, SidebarSection } from "@mariozechner/mini-lit";
import { Router } from "@vaadin/router";
import { html } from "lit";
import "./app.css";

// Import pages
import "./pages/home.js";
import "./pages/buttons.js";
import "./pages/cards.js";
import "./pages/inputs.js";
import "./pages/selects.js";
import "./pages/checkboxes.js";
import "./pages/switches.js";
import "./pages/badges.js";
import "./pages/alerts.js";
import "./pages/progress.js";
import "./pages/dialogs.js";
import "./pages/separators.js";
import "./pages/textareas.js";
import "./pages/labels.js";
import "./pages/codeblock.js";
import "./pages/markdown.js";
import "./pages/copybutton.js";
import "./pages/downloadbutton.js";
import "./pages/languageselector.js";
import "./pages/splitpanel.js";
import "./pages/diff.js";
import "./pages/sidebar.js";

const outlet = document.getElementById("outlet");
const router = new Router(outlet);

router.setRoutes([
   { path: "/", component: "page-home" },
   { path: "/buttons", component: "page-buttons" },
   { path: "/cards", component: "page-cards" },
   { path: "/inputs", component: "page-inputs" },
   { path: "/selects", component: "page-selects" },
   { path: "/checkboxes", component: "page-checkboxes" },
   { path: "/switches", component: "page-switches" },
   { path: "/badges", component: "page-badges" },
   { path: "/alerts", component: "page-alerts" },
   { path: "/progress", component: "page-progress" },
   { path: "/dialogs", component: "page-dialogs" },
   { path: "/separators", component: "page-separators" },
   { path: "/textareas", component: "page-textareas" },
   { path: "/labels", component: "page-labels" },
   { path: "/codeblock", component: "page-codeblock" },
   { path: "/markdown", component: "page-markdown" },
   { path: "/copybutton", component: "page-copybutton" },
   { path: "/downloadbutton", component: "page-downloadbutton" },
   { path: "/languageselector", component: "page-languageselector" },
   { path: "/splitpanel", component: "page-splitpanel" },
   { path: "/diff", component: "page-diff" },
   { path: "/sidebar", component: "page-sidebar" },
]);

// Setup sidebar content
const sidebarContent = html`
   ${SidebarItem({ href: "/", children: "Home" })}
   ${SidebarSection({
      title: "Actions",
      children: html`
         ${SidebarItem({ href: "/buttons", children: "Buttons" })}
         ${SidebarItem({ href: "/copybutton", children: "Copy Button" })}
         ${SidebarItem({ href: "/downloadbutton", children: "Download Button" })}
      `,
   })}
   ${SidebarSection({
      title: "Layout",
      children: html`
         ${SidebarItem({ href: "/cards", children: "Cards" })}
         ${SidebarItem({ href: "/separators", children: "Separators" })}
         ${SidebarItem({ href: "/sidebar", children: "Sidebar" })}
         ${SidebarItem({ href: "/splitpanel", children: "Split Panel" })}
         ${SidebarItem({ href: "/dialogs", children: "Dialogs" })}
      `,
   })}
   ${SidebarSection({
      title: "Forms",
      children: html`
         ${SidebarItem({ href: "/inputs", children: "Inputs" })}
         ${SidebarItem({ href: "/textareas", children: "Textareas" })}
         ${SidebarItem({ href: "/selects", children: "Selects" })}
         ${SidebarItem({ href: "/checkboxes", children: "Checkboxes" })}
         ${SidebarItem({ href: "/switches", children: "Switches" })}
         ${SidebarItem({ href: "/labels", children: "Labels" })}
      `,
   })}
   ${SidebarSection({
      title: "Feedback",
      children: html`
         ${SidebarItem({ href: "/badges", children: "Badges" })} ${SidebarItem({ href: "/alerts", children: "Alerts" })}
         ${SidebarItem({ href: "/progress", children: "Progress" })}
      `,
   })}
   ${SidebarSection({
      title: "Content",
      children: html`
         ${SidebarItem({ href: "/codeblock", children: "Code Block" })}
         ${SidebarItem({ href: "/markdown", children: "Markdown" })}
         ${SidebarItem({ href: "/diff", children: "Diff Viewer" })}
      `,
   })}
   ${SidebarSection({
      title: "Utilities",
      children: html`
         ${SidebarItem({ href: "/languageselector", children: "Language Selector" })}
         ${SidebarItem({ href: "/i18n", children: "i18n" })}
      `,
   })}
`;

const sidebarLogo = html` <h1 class="text-2xl font-bold">mini-lit</h1> `;

// Set sidebar properties
const sidebar = document.querySelector("mini-sidebar") as any;
if (sidebar) {
   sidebar.logo = sidebarLogo;
   sidebar.content = sidebarContent;
   sidebar.breakpoint = "md";
}
