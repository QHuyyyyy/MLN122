import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CaseGenerator from "./pages/CaseGenerator";
import MindMap from "./pages/MindMap";
import Chatbot from "./pages/Chatbot";
import Practice from "./pages/Practice";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/case-generator"} component={CaseGenerator} />
      <Route path={"/mindmap"} component={MindMap} />
      <Route path={"/chat"} component={Chatbot} />
      <Route path={"/practice"} component={Practice} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
