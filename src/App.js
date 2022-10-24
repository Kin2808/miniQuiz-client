import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Teacher from "./pages/Teacher";
import Students from "./pages/Students";
import Home from "./pages/Home";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/students" element={<Students />} />

            {/* ERROR PAGE */}
            <Route
              path="*"
              element={
                <main style={{ textAlign: "center", fontSize: 40 }}>
                  <h1>404 Page Not Found</h1>
                </main>
              }
            />
          </Routes>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
