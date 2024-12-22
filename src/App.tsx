import { useEffect, useState } from "react";
import "./App.css";

import Category from "./components/category/Category";
import Header from "./components/Header";
import { Tab, Tabs, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import Items from "./components/Items/Items";
import { useDataStateContext } from "./components/context/DataStateContext";
import { Input, XFileReader } from "@manish774/smarty-ui";
import { useFireBase } from "./context/FirebaseConfigContext";
import ShutdownIcon from "@mui/icons-material/PowerSettingsNew";
interface ImyUserCoonnfig {
  [key: string]: {
    left: number;
    right: number;
    scroll: number;
  };
}
function App() {
  const [value, setValue] = useState(0);
  const { state } = useDataStateContext();
  const [validated, setValidated] = useState(false);
  const { state: firebaseState } = useFireBase();
  const [validatePoints, setValidatePoints] = useState<Record<string, any>>({
    left: 0,
    right: 0,
    scroll: 10,
  });

  const myUserConfig: ImyUserCoonnfig = {
    manish: {
      left: 1,
      right: 2,
      scroll: 77,
    },
    priya: {
      left: 2,
      right: 1,
      scroll: 70,
    },
    udupi: {
      left: 0,
      right: 0,
      scroll: 70,
    },
  };

  const myUsers = Object.keys(myUserConfig);
  const currentUser = firebaseState.userId;
  const [alignment, setAlignment] = useState("manish");
  const { state: firebaseUser, dispatch: firebaseDispatch } = useFireBase();

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
        scroll: parseInt(e.target.value),
      }));
  };
  useEffect(() => {
    if (
      validatePoints.left === myUserConfig[currentUser].left &&
      validatePoints.right === myUserConfig[currentUser].right &&
      validatePoints.scroll === myUserConfig[currentUser].scroll
    ) {
      setValidated(true);
    }
  }, [validatePoints]);

  const resetValidate = () => {
    setValidatePoints({ left: 0, right: 0, scroll: 0 });
  };

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    newAlignment && setAlignment(newAlignment);
    newAlignment &&
      firebaseDispatch({ type: "changeId", payload: newAlignment });
  };

  return !state?.isLoggedIn ? (
    <>
      {validated ? (
        <>
          <button
            className="right-item"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
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
          <ToggleButtonGroup
            color="secondary"
            value={alignment}
            exclusive
            onChange={handleToggle}
            aria-label="Platform"
            style={{ position: "absolute", bottom: 0, left: "25%", zIndex: 99 }}
          >
            {myUsers.map((x) => (
              <ToggleButton
                value={x}
                style={{
                  color: alignment === x ? "#fff" : "#ccc", // White text for selected, lighter for unselected
                  backgroundColor: alignment === x ? "#555" : "transparent", // Dark background for selected
                  border: "1px solid #777", // Add subtle border for buttons
                }}
              >
                {x}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="con">
            <button
              className="val"
              onClick={(e) => {
                handleValidate("left");
              }}
            ></button>
            <button
              className="val"
              onClick={(e) => {
                handleValidate("right");
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
                value={`${validatePoints.scroll}`}
                // debounceTime={1}
                className="my-slider-face"
              />
              <>{validatePoints.scroll}</>
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
