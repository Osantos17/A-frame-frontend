import { Header } from "./Header"
import { Content } from "./Content"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Content />} />
        </Routes>  
      </BrowserRouter>  
    </div>
  )
}

export default App;