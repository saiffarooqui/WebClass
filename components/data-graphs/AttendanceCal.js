import React from "react";
import { Chart } from "react-google-charts";
import { Box, Stack } from "@chakra-ui/react";
import DashboardNavBar from "../dashboard/DashboardNavBar";

export const options = {
  title: "Class Attendance",
};

function Cal({ data }) {
  let mama = [
    [
      { type: "date", id: "Date" },
      { type: "number", id: "Won/Loss" },
    ],
    
  ];
  
  if (data.length != 0) {
    //creating an object to with key as date and values as no of students
    let formatData = {};
    //finding no of students on each day of class
    for (let i in data) {
      //format addressing
      data[i].date = new Date(
        new Date(data[i].date).getFullYear(),
        new Date(data[i].date).getMonth(),
        new Date(data[i].date).getDate()
      );
      //if a new date than first initialize it
      if (formatData[new Date(data[i].date)] === undefined)
        formatData[new Date(data[i].date)] = 0;
      formatData[new Date(data[i].date)] += 1;
    }
    //convert the object to array to make the computation easier
    formatData = Object.entries(formatData);
    //Frame the date in accepted format fo Gchart
    formatData.forEach((element) => {
      mama.push([new Date(element[0]), element[1]]);
    });
    // console.log("mama", mama);
  }
  return (
    <>
      <Stack
        width={"full"}
        mt={15}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Chart
          chartType="Calendar"
          width={1000}
          data={mama}
          options={options}
        />
      </Stack>
    </>
  );
}

export default Cal;
