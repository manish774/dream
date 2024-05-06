import { useState } from "react";
import "./App.css";

import Category from "./components/category/Category";
import Header from "./components/Header";
import { Tab, Tabs, Box } from "@mui/material";
import Items from "./components/Items/Items";
import { useDataStateContext } from "./components/context/DataStateContext";

function App() {
  const [value, setValue] = useState(0);
  const { state } = useDataStateContext();
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  console.log(state?.isLoggedIn);
  return !state?.isLoggedIn ? (
    <div className="app-main-container">
      <div className="app-form-container">
        <Header />
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="tabs"
        >
          <Tab label="Items" />
          <Tab label="Category" />
        </Tabs>
        <Box>
          {value === 0 && (
            <TabPanel value={value} index={0}>
              <Items />
            </TabPanel>
          )}
          {value === 1 && (
            <TabPanel value={value} index={1}>
              <Category />
            </TabPanel>
          )}
        </Box>
      </div>
    </div>
  ) : (
    <Header />
  );
}

function TabPanel(props: any) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default App;
