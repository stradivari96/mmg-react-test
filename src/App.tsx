import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment-timezone";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Clock from "./components/Clock";
import Header from "./components/Header";

import "./App.css";

const ALARMS_URL =
  "https://raw.githubusercontent.com/medlabmg/developers-tests/master/frontend/alarm.json";

type Alarm = {
  id: number;
  time: string;
  message: string;
  active: boolean;
};

function App() {
  const [time, setTime] = useState(moment());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [timezone, setTimezone] = useState<string>(moment.tz.guess());

  useEffect(() => {
    async function fetchAlarms() {
      let response: any = await fetch(ALARMS_URL);
      response = await response.json();
      setAlarms(response);
    }
    fetchAlarms();
  }, []);

  useEffect(() => {
    setTime(moment().tz(timezone));
    const interval = setInterval(() => setTime(moment().tz(timezone)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timezone]);

  useEffect(() => {
    if (time.seconds() === 0) {
      const hour = time.hours();
      const minute = time.minutes();
      const alerts = alarms
        .filter((a) => {
          let [alarmHour, alarmMinute] = a.time.split(":").map(Number);
          return a.active && alarmHour === hour && alarmMinute === minute;
        })
        .map((a) => a.message);
      Swal.queue(alerts);
    }
  }, [time, alarms]);

  return (
    <div className="App">
      <Header />
      <Autocomplete
        className="timezone"
        options={moment.tz.names()}
        renderInput={(params) => (
          <TextField {...params} label="Timezone" variant="outlined" />
        )}
        value={timezone}
        onChange={(event, value) =>
          value ? setTimezone(value) : setTimezone(moment.tz.guess())
        }
      />
      <Clock time={time} />
    </div>
  );
}

export default App;
