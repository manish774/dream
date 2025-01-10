import { useEffect, useState } from "react";
import "./App.css";

import Category from "./components/category/Category";
import Header from "./components/Header";
import { Tab, Tabs, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import Items from "./components/Items/Items";
import { useDataStateContext } from "./components/context/DataStateContext";
import { useFireBase } from "./context/FirebaseConfigContext";
import ShutdownIcon from "@mui/icons-material/PowerSettingsNew";
import Auth from "./components/Auth/Auth";

function App() {
  const [value, setValue] = useState(0);
  const { state } = useDataStateContext();
  const { state: firebaseState, dispatch: firebaseDispatch } = useFireBase();

  const myUserConfig = {
    manish: [
      { defaultValue: 10, valid: 100 },
      { defaultValue: 0, valid: 100 },
      { defaultValue: 0, valid: 100 },
    ],
    priya: [
      { defaultValue: 0, valid: 100 },
      { defaultValue: 0, valid: 100 },
    ],
    udupi: [{ defaultValue: 0, valid: 50 }],
  };

  const myUsers = Object.keys(myUserConfig);
  const [alignment, setAlignment] = useState(firebaseState.userId || "manish");

  const [validityState, setValidityState] = useState<{
    [index: number]: boolean;
  }>({});

  // Reset validityState when the user changes
  useEffect(() => {
    const initialValidityState = myUserConfig[alignment]?.reduce(
      (acc, _, index) => ({ ...acc, [index]: false }),
      {}
    );
    setValidityState(initialValidityState || {});
  }, [alignment]);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment) {
      setAlignment(newAlignment);
      firebaseDispatch({ type: "changeId", payload: newAlignment });
    }
  };

  const handleOnChange = (isValid: boolean, index: number) => {
    console.log(isValid, index);
    setValidityState((prev) => ({
      ...prev,
      [index]: isValid,
    }));
  };

  const allValid = Object.values(validityState).every((isValid) => isValid);
  console.log(validityState, myUserConfig[alignment]);
  return !state?.isLoggedIn ? (
    <div>
      {allValid ? (
        <>
          <button
            className="right-item"
            onClick={() => window.location.reload()}
            style={{ position: "absolute", right: 0, zIndex: 9999 }}
          >
            <ShutdownIcon />
          </button>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="tabs"
          >
            <Tab label="Items" />
            <Tab label="Category" />
          </Tabs>
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
      ) : (
        <div className="auth-container-inp">
          <ToggleButtonGroup
            color="secondary"
            value={alignment}
            exclusive
            onChange={handleToggle}
            aria-label="User Selection"
            style={{
              position: "absolute",
              bottom: 20,
              left: "25%",
              zIndex: 99,
            }}
          >
            {myUsers.map((user) => (
              <ToggleButton
                key={user}
                value={user}
                style={{
                  color: alignment === user ? "#fff" : "#ccc",
                  backgroundColor: alignment === user ? "#555" : "transparent",
                  border: "1px solid #777",
                }}
                aria-label={`Select user ${user}`}
              >
                {user}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="con">
            <div className="my-slider-container">
              {myUserConfig[alignment]?.map((config, index) => (
                <Auth
                  key={index}
                  config={config}
                  onChangeHandlerValue={(isValid) =>
                    handleOnChange(isValid, index)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
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
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}

export default App;
