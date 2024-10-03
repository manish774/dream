import { useEffect, useState } from "react";
import "./App.css";

import Category from "./components/category/Category";
import Header from "./components/Header";
import { Tab, Tabs, Box } from "@mui/material";
import Items from "./components/Items/Items";
import { useDataStateContext } from "./components/context/DataStateContext";
import { Input, XFileReader } from "@manish774/smarty-ui";

function App() {
  const [value, setValue] = useState(0);
  const { state } = useDataStateContext();
  const [validated, setValidated] = useState(false);
  const [validatePoints, setValidatePoints] = useState<Record<string, any>>({
    validate1: 0,
    validate2: 0,
    validate3: 10,
  });

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleValidate = (vp) => {
    setValidatePoints((prev) => ({
      ...validatePoints,
      [vp]: parseInt(validatePoints[vp]) + 1,
    }));
  };
  const handleSidler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e &&
      setValidatePoints((prev) => ({
        ...prev,
        validate3: parseInt(e.target.value),
      }));
  };
  useEffect(() => {
    if (
      validatePoints.validate1 === 2 &&
      validatePoints.validate2 === 1 &&
      validatePoints.validate3 > 90
    ) {
      setValidated(true);
    }
  }, [validatePoints]);

  const resetValidate = () => {
    setValidatePoints({ validate1: 0, validate2: 0, validate3: 0 });
  };

  return !state?.isLoggedIn ? (
    <>
      {validated ? (
        <>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="tabs"
          >
            <Tab label="Items" />
            <Tab label="Category" />
          </Tabs>
          <>
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
          </>
        </>
      ) : (
        <div className="auth-container-inp">
          <div className="con">
            <button
              className="val"
              onClick={(e) => {
                handleValidate("validate1");
              }}
            ></button>
            <button
              className="val"
              onClick={(e) => {
                handleValidate("validate2");
              }}
            ></button>
            <button
              className="reset"
              onClick={(e) => {
                resetValidate();
              }}
            ></button>
            <div className="my-slider-container">
              <input
                onChange={handleSidler}
                type={"range"}
                value={`${validatePoints.validate3}`}
                // debounceTime={1}
                className="my-slider-face"
              />
            </div>
          </div>
        </div>
      )}
    </>
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
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

export default App;
