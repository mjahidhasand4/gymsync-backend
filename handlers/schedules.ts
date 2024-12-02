import { Request, Response } from "express";
import { validateRequestBody } from "../lib";
import { scheduleSchema } from "../schemas";
import {
  joinTraineeToSchedule,
  assignTrainerToSchedule,
  createSchedule,
  findUserById,
  getSchedulesById,
  getSchedulesByTrainerId,
  getSchedulesCountByDate,
  isTraineeJoinedToSchedule,
  isTrainerAssignedToSchedule,
  countTraineesForSchedule,
} from "../controllers";

export const scheduleHandler = async (req: Request, res: Response) => {
  const isValid = validateRequestBody(scheduleSchema, req, res);
  if (!isValid) return;

  const { startTime } = req.body;

  try {
    const parsedStartTime = new Date(startTime);

    const parsedEndTime = new Date(
      parsedStartTime.getTime() + 2 * 60 * 60 * 1000
    );

    const classCount = await getSchedulesCountByDate(parsedStartTime);

    if (classCount === 5) {
      res.status(400).json({
        success: false,
        message: "Cannot schedule more than 5 classes per day.",
      });
      return;
    }

    await createSchedule(startTime, parsedEndTime);

    res.status(201).json({
      success: true,
      message: "Class schedule created successfully.",
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const trainerSchedulesHandler = async (req: Request, res: Response) => {
  const { trainerId } = req.params;

  try {
    const schedules = await getSchedulesByTrainerId(trainerId);

    if (!schedules || schedules.length === 0) {
      res.status(404).json({
        success: false,
        message: "No schedules found for the specified trainer.",
      });
    }

    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const assignTrainerToScheduleHandler = async (
  req: Request,
  res: Response
) => {
  const { scheduleId, trainerId } = req.body;

  if (!scheduleId || !trainerId) {
    res.status(400).json({
      success: false,
      message: "Schedule ID and Trainer ID are required.",
    });
    return;
  }

  try {
    const schedule = await getSchedulesById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
      return;
    }

    const trainer = await findUserById(trainerId);

    if (!trainer) {
      res.status(404).json({
        success: false,
        message: "Trainer not found.",
      });
      return;
    }

    const existingAssignment = await isTrainerAssignedToSchedule(
      scheduleId,
      trainerId
    );

    if (existingAssignment) {
      res.status(400).json({
        success: false,
        message: "Trainer is already assigned to this schedule.",
      });
      return;
    }

    const trainerSchedule = await assignTrainerToSchedule(
      scheduleId,
      trainerId
    );

    res.status(201).json({
      success: true,
      message: "Trainer assigned to the schedule successfully.",
      data: trainerSchedule,
    });
  } catch (error) {
    console.error("Error assigning trainer to schedule:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const joinSchedulesHandler = async (req: Request, res: Response) => {
  const { scheduleId, traineeId } = req.body;

  if (!scheduleId || !traineeId) {
    res.status(400).json({
      success: false,
      message: "Schedule ID and Trainee ID are required.",
    });
    return;
  }

  try {
    const schedule = await getSchedulesById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
      return;
    }

    const traineeCount = (await countTraineesForSchedule(scheduleId)) ?? 0;

    if (traineeCount >= 10) {
      res.status(400).json({
        success: false,
        message:
          "This schedule has reached the maximum capacity of 10 trainees.",
      });
      return;
    }

    const trainee = await findUserById(traineeId);

    if (!trainee) {
      res.status(404).json({
        success: false,
        message: "Trainee not found.",
      });
      return;
    }

    const existingAssignment = await isTraineeJoinedToSchedule(
      scheduleId,
      traineeId
    );

    if (existingAssignment) {
      res.status(400).json({
        success: false,
        message: "Trainee is already joined to this schedule.",
      });
      return;
    }

    const scheduledTrainee = await joinTraineeToSchedule(scheduleId, traineeId);

    res.status(201).json({
      success: true,
      message: "Trainee joined to the schedule successfully.",
      data: scheduledTrainee,
    });
  } catch (error) {
    console.error("Error joining trainee to schedule:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
