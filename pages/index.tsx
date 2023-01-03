import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // this is home page for the habit tracker app
  // home is the name of the page
  // home contain a table of habits and a button to add a new habit
  // home contain current date and a button to change the date to check previous habits
  // every habit contain a checkbox to mark it as done or not
  // habit contain score card to show how many times the habit is done in the current month
  // habit contain a button to edit the habit
  // habit contain a button to delete the habit
  // habit contain a button to add a new habit
  // all of this data is store in the local storage
  // the data is store in the local storage as a json object
  // the json object contain the date of the habit and the name of the habit

  // if not window object is not available then return null

  // load the habitJson key from the local storage

  // create a state to store the habitJson
  const [habitJson, setHabitJson] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNextDateButton, setShowNextDateButton] = useState(true);
  const [habitList, setHabitList] = useState();

  useEffect(() => {
    if (!localStorage.getItem("habitJson")) {
      localStorage.setItem("habitJson", JSON.stringify({}));
    } else {
      const localHabitJson = localStorage.getItem("habitJson");
      if (localHabitJson) {
        setHabitJson(JSON.parse(localHabitJson));
      }
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("habitList")) {
      console.log("comming here");
      localStorage.setItem("habitList", JSON.stringify([]));
    } else {
      const localHabitJson = localStorage.getItem("habitList");
      if (localHabitJson) {
        setHabitList(JSON.parse(localHabitJson));
      }
    }
  }, []);

  useEffect(() => {
    if (habitJson) {
      localStorage.setItem("habitJson", JSON.stringify(habitJson));
    }
  }, [habitJson]);

  useEffect(() => {
    if (habitList) {
      localStorage.setItem("habitList", JSON.stringify(habitList));
    }
  }, [habitList]);
  useEffect(() => {
    if (selectedDate.toDateString() === new Date().toDateString()) {
      setShowNextDateButton(false);
    } else {
      setShowNextDateButton(true);
    }
  }, [selectedDate]);

  useEffect(() => {
    // when selectedDate changes check if the date is present in the habitJson or not
    // if not present then add the date to the habitJson and set the habitJson state
    // add all habit list item missing from the selected date habit json
    if (habitJson && habitList) {
      if (!habitJson[selectedDate.toDateString()]) {
        const newHabitJson = {
          ...habitJson,
          [selectedDate.toDateString()]: {},
        };
        habitList.forEach((habit) => {
          newHabitJson[selectedDate.toDateString()][habit.habitId] = {
            ...habit,
            habitDone: false,
            habitScore: 0,
          };
        });
        setHabitJson(newHabitJson);
      } else {
        // add all habit list item missing from the selected date habit json
        const newHabitJson = {
          ...habitJson,
          [selectedDate.toDateString()]: {
            ...habitJson[selectedDate.toDateString()],
          },
        };
        habitList.forEach((habit) => {
          if (!newHabitJson[selectedDate.toDateString()][habit.habitId]) {
            newHabitJson[selectedDate.toDateString()][habit.habitId] = {
              ...habit,
              habitDone: false,
              habitScore: 0,
            };
          }
        });
        setHabitJson(newHabitJson);
      }
    }
  }, [selectedDate]);

  const addNewHabit = () => {
    const habitName = prompt("Enter the name of the habit");
    if (habitName) {
      const newHabit = {
        habitId: Math.random(),
        habitName,
      };
      const newHabitJson = {
        ...habitJson,
        [selectedDate.toDateString()]: {
          ...habitJson[selectedDate.toDateString()],
          [newHabit.habitId]: { ...newHabit, habitDone: false, habitScore: 0 },
        },
      };
      setHabitJson(newHabitJson);
      setHabitList([...habitList, newHabit]);
    }
  };
  const editHabit = (habitId) => {
    const habitName = prompt("Enter the name of the habit");
    if (habitName) {
      const newHabitJson = {
        ...habitJson,
        [selectedDate.toDateString()]: {
          ...habitJson[selectedDate.toDateString()],
          [habitId]: {
            ...habitJson[selectedDate.toDateString()][habitId],
            habitName,
          },
        },
      };
      setHabitJson(newHabitJson);
      const newHabitList = habitList.map((habit) => {
        if (habit.habitId === habitId) {
          return { ...habit, habitName };
        }
        return habit;
      });
      setHabitList(newHabitList);
    }
  };
  const toggleHabitDone = (habitId) => {
    const newHabitJson = {
      ...habitJson,
      [selectedDate.toDateString()]: {
        ...habitJson[selectedDate.toDateString()],
        [habitId]: {
          ...habitJson[selectedDate.toDateString()][habitId],
          habitDone: !habitJson[selectedDate.toDateString()][habitId].habitDone,
        },
      },
    };
    setHabitJson(newHabitJson);
  };
  const deleteHabit = (habitId) => {
    const newHabitJson = {
      ...habitJson,
      [selectedDate.toDateString()]: {
        ...habitJson[selectedDate.toDateString()],
      },
    };
    delete newHabitJson[selectedDate.toDateString()][habitId];
    setHabitJson(newHabitJson);
    const newHabitList = habitList.filter((habit) => habit.habitId !== habitId);
    setHabitList(newHabitList);
  };
  return (
    <>
      <Head>
        <title>Habit Tracker App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-full flex flex-col justify-center align-middle items-center">
        {/* add date selector here */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
          >
            {"<"}
          </button>
          <h1 className="text-2xl font-bold underline">
            {selectedDate.toDateString()}
          </h1>
          {showNextDateButton && (
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              {">"}
            </button>
          )}
        </div>
        {/* habbit app starts from here  */}
        {/* this is the table of the habits */}
        {/* use selected Date to find habit and render them  */}
        <div className="flex justify-center">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Habit Name</th>
                <th className="px-4 py-2">Habit Done</th>
                <th className="px-4 py-2">Habit Score</th>
                <th className="px-4 py-2">Edit Habit</th>
                <th className="px-4 py-2">Delete Habit</th>
              </tr>
            </thead>
            <tbody>
              {habitJson &&
                Object.keys(habitJson).map((habitDate) => {
                  if (habitDate === selectedDate.toDateString()) {
                    return Object.keys(habitJson[habitDate]).map((habitId) => {
                      return (
                        <tr key={habitId}>
                          <td className="border px-4 py-2">
                            {/* get name from habit list based on habit id  */}
                            {habitList.map((habit) => {
                              if (habit.habitId == habitId) {
                                return habit.habitName;
                              }
                            })}
                          </td>
                          <td className="border px-4 py-2">
                            <input
                              type="checkbox"
                              checked={habitJson[habitDate][habitId].habitDone}
                              onChange={(e) => {
                                toggleHabitDone(
                                  habitJson[habitDate][habitId].habitId
                                );
                              }}
                            />
                          </td>
                          <td className="border px-4 py-2">
                            {habitJson[habitDate][habitId].habitScore}
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => {
                                editHabit(
                                  habitJson[habitDate][habitId].habitId
                                );
                              }}
                            >
                              Edit Habit
                            </button>
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => {
                                const newHabitJson = { ...habitJson };
                                delete newHabitJson[habitDate][habitId];
                                setHabitJson(newHabitJson);
                              }}
                            >
                              Delete Habit
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  }
                })}
            </tbody>
          </table>
          <div>
            <button onClick={addNewHabit}>Add Habit</button>
          </div>
        </div>
      </div>
    </>
  );
}
