import "./App.css";
import { SearchFrame } from "./searchframe/SearchFrame";
import PropTypes from "prop-types";

function App({ tearDownRoot }) {
  return <SearchFrame tearDownRoot={tearDownRoot} />;
}

App.propTypes = {
  tearDownRoot: PropTypes.func.isRequired,
};

export default App;
