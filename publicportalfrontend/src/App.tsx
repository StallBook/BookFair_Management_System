import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
