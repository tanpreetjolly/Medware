import React, { useEffect, useRef } from "react";
import crossIcon from "../img/cross icon.svg";
import { TextField, Button, Grid } from "@mui/material";
import axios from "axios";

import { useGlobalContext } from "./context";
const currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };

const LogModal = ({ logModal, setLogModal }) => {
  const { formData, fetchData, setFormData, url } = useGlobalContext();
  const afterRef = useRef("");
  const beforeRef = useRef("");
  const highRef = useRef("");
  const lowRef = useRef("");
  const dateRef = useRef("");

  useEffect(() => {
    const dateString = currentDate.toLocaleDateString("en-IN", options);
    dateRef.current = dateString;
  }, []);

  const closeLogModal = () => {
    setLogModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };

      // Append form values and date to bp_log
      updatedFormData.bp_log.high.push(highRef.current.value);
      updatedFormData.bp_log.low.push(lowRef.current.value);
      updatedFormData.bp_log.date.push(dateRef.current);

      // Append form values and date to blood_glucose
      updatedFormData.blood_glucose.before.push(beforeRef.current.value);
      updatedFormData.blood_glucose.after.push(afterRef.current.value);
      updatedFormData.blood_glucose.date.push(dateRef.current);

      return updatedFormData;
    });

    try {
      await axios.put(url, formData, {
        withCredentials: true,
      });

      await fetchData();
    } catch (error) {
      console.log(error);
    }

    closeLogModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains("modal")) {
        closeLogModal();
      }
    };

    if (logModal) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [logModal]);

  if (!logModal) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-4 backdrop-blur-sm modal">
      <div className="flex flex-col gap-2 items-center w-72 sm:w-1/3  flex-wrap  bg-white rounded-lg shadow-lg p-8">
        <div className="w-full flex justify-end">
          <button onClick={closeLogModal} className="hover:scale-105">
            <img src={crossIcon} alt="cross-icon" loading="lazy" />
          </button>
        </div>
        <h1 className="text-3xl  mt-4 font-semibold text-gray-700">
          MEDICAL LOG
        </h1>
        <form
          className="w-full flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="p-1 text-lg text-teal-600 font-semibold">
            {dateRef.current}
          </h2>
          <h3 className="w-full text-xl font-semibold text-gray-600 px-1">
            Blood Pressure Level
          </h3>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="high"
                label="High"
                inputRef={highRef}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="low"
                label="Low"
                inputRef={lowRef}
                type="number"
              />
            </Grid>
          </Grid>
          <h3 className="w-full text-xl font-semibold text-gray-600 px-1">
            Glucose Level
          </h3>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="before"
                label="Before Breakfast"
                inputRef={beforeRef}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="after"
                label="After Breakfast"
                inputRef={afterRef}
                type="number"
              />
            </Grid>
          </Grid>
          <Button variant="outlined" color="success" type="submit">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LogModal;