import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment-timezone";

import Clock from "./components/Clock";

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
  const [timezone, setTimezone] = useState(moment.tz.guess());

  useEffect(() => {
    async function fetchAlarms() {
      let response: any = await fetch(ALARMS_URL);
      response = await response.json();
      setAlarms(response);
    }
    fetchAlarms();
    setInterval(() => setTime(moment().tz(timezone)), 1000);
  }, []);

  useEffect(() => {
    if (time.seconds() === 0) checkAlarms();
  }, [time]);

  const checkAlarms = () => {
    const hour = time.hours();
    const minute = time.minutes();
    const alerts: string[] = [];
    alarms
      .filter((a) => a.active)
      .forEach((a) => {
        const [alarmHour, alarmMinute] = a.time.split(":").map(Number);
        if (alarmHour === hour && alarmMinute === minute)
          alerts.push(a.message);
      });
    Swal.queue(alerts);
  };

  return (
    <div className="App">
      <Clock time={time} />
    </div>
  );
}

export default App;
