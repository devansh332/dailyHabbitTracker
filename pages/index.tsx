import Head from "next/head";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [habitJson, setHabitJson] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNextDateButton, setShowNextDateButton] = useState(true);
  const [habitList, setHabitList] = useState();
  const [habitScoreCard, setHabitScoreCard] = useState({});
  const [showDancingEmoji, setShowDancingEmoji] = useState(false);

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
    // set showDancingEmoji to false after 5 seconds
    if (!showDancingEmoji) {
      return;
    }
    const timeout = setTimeout(() => {
      setShowDancingEmoji(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [showDancingEmoji]);

  useEffect(() => {
    if (!localStorage.getItem("habitList")) {
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
      localStorage.setItem("habitJson", JSON.stringify(habitJson as []));
    }
  }, [habitJson]);

  useEffect(() => {
    if (habitList) {
      localStorage.setItem("habitList", JSON.stringify(habitList as []));
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

  useEffect(() => {
    if (habitJson) {
      const isAllTaskDone = checkIfAllHabitDoneForToday();
      console.log(isAllTaskDone, "isAllTaskDone");
      if (isAllTaskDone) {
        setShowDancingEmoji(true);
      } else {
        setShowDancingEmoji(false);
      }
    }
  }, [habitJson]);

  useEffect(() => {
    if (habitJson && habitList) {
      const newHabitScoreCard = {};
      habitList.forEach((habit) => {
        newHabitScoreCard[habit.habitId] = 0;
      });
      Object.keys(habitJson).forEach((date) => {
        Object.keys(habitJson[date]).forEach((habitId) => {
          if (habitJson[date][habitId].habitDone) {
            newHabitScoreCard[habitId] += 1;
          }
        });
      });
      setHabitScoreCard(newHabitScoreCard);
    }
  }, [habitJson, habitList]);

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
  const checkIfAllHabitDoneForToday = () => {
    let allHabitDone = true;
    Object.keys(habitJson[selectedDate.toDateString()]).forEach((habitId) => {
      console.log(habitJson[selectedDate.toDateString()][habitId]);
      if (!habitJson[selectedDate.toDateString()][habitId].habitDone) {
        allHabitDone = false;
      }
    });
    return allHabitDone;
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
      {showDancingEmoji && (
        <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center">
          <div className="animate-bounce">
            <span role="img" aria-label="dancing emoji">
              <Image src="/dancingLady.gif" width={300} height={300} alt="" />
            </span>
          </div>
        </div>
      )}
      <div className="fixed bottom-20 right-5">
        <button
          className="border bg-blue-600 w-32 h-14 rounded-2xl text-white shadow-xl"
          onClick={addNewHabit}
        >
          Add Habit
        </button>
      </div>
      <div className="h-full w-full flex flex-col justify-around align-middle items-center p-4 bg-gray-100">
        <div className="flex justify-around w-full">
          <button
            className="border bg-blue-600 w-14 h-14 rounded-2xl text-white shadow-xl"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
          >
            {"<"}
          </button>
          <div className="flex flex-col align-middle justify-center items-center px-4 shadow-lg rounded-xl">
            <h1 className="text-2xl font-semibold text-blue-400   text-center ">
              {selectedDate.toDateString()}
            </h1>
          </div>

          <button
            className={`border ${
              showNextDateButton ? "bg-blue-600" : "bg-gray-400"
            } w-14 h-14 rounded-2xl text-white shadow-xl`}
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
            disabled={!showNextDateButton}
          >
            {">"}
          </button>
        </div>
        <div className="flex justify-center p-4 shadow-lg w-full">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-green-700">
                <th className="px-4 py-2"> Name</th>
                <th className="px-4 py-2"> Done</th>
                {/* <th className="px-4 py-2"> Score</th> */}
                <th className="px-4 py-2">Edit </th>
                <th className="px-4 py-2">Delete </th>
              </tr>
            </thead>
            <tbody>
              {habitJson &&
                Object.keys(habitJson).map((habitDate) => {
                  if (habitDate === selectedDate.toDateString()) {
                    return Object.keys(habitJson[habitDate]).map((habitId) => {
                      return (
                        <>
                          <tr
                            key={habitId}
                            className={`${
                              habitJson[habitDate][habitId].habitDone
                                ? "bg-green-300"
                                : ""
                            }`}
                          >
                            <td className="border-4 px-4 py-2 text-ellipsis break-words max-w-0">
                              {/* get name from habit list based on habit id  */}
                              {habitList.map((habit) => {
                                if (habit.habitId == habitId) {
                                  return habit.habitName;
                                }
                              })}
                            </td>
                            <td className="border-4 px-4 py-2">
                              <input
                                type="checkbox"
                                checked={
                                  habitJson[habitDate][habitId].habitDone
                                }
                                onChange={(e) => {
                                  toggleHabitDone(
                                    habitJson[habitDate][habitId].habitId
                                  );
                                }}
                                className="w-6 h-6 text-green-600 border-0 rounded-full focus:ring-0"
                              />
                            </td>
                            {/* <td className="border-4 px-4 py-2">
                              {habitJson[habitDate][habitId].habitScore}
                            </td> */}
                            <td className="border-4 px-4 py-2">
                              <button
                                onClick={() => {
                                  editHabit(
                                    habitJson[habitDate][habitId].habitId
                                  );
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            <td className="border-4 px-4 py-2">
                              <button
                                onClick={() => {
                                  const newHabitJson = { ...habitJson };
                                  delete newHabitJson[habitDate][habitId];
                                  setHabitJson(newHabitJson);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    });
                  }
                })}
            </tbody>
          </table>
        </div>
        {/* add habit Score card */}
        <div className="flex justify-center mt-4">
          <div className="">
            <div className="bg-gray-200 rounded-lg shadow-lg p-4">
              <div className="flex justify-between">
                <div className="flex">
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Habit Score</h1>
                    <p className="text-sm text-gray-500">
                      {selectedDate.toDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6 ">
          {habitScoreCard &&
            Object.keys(habitScoreCard).map((habitId) => {
              return (
                <div key={habitId} className="">
                  <div
                    className={`${
                      habitScoreCard[habitId] > 0
                        ? "bg-green-300"
                        : "bg-gray-200"
                    } rounded-lg shadow-lg p-4`}
                  >
                    <div className="flex justify-between">
                      <div className="flex">
                        <div className="flex flex-col">
                          <h1 className="text-xl font-bold">
                            {habitList.map((habit) => {
                              if (habit.habitId == habitId) {
                                return habit.habitName;
                              }
                            })}
                          </h1>
                          <p className="text-3xl text-gray-500">
                            {habitScoreCard[habitId]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
