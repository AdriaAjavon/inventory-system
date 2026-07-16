import { businessCopilot } from "../services/businessCopilot.js";

export const executeCommand = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        type: "error",
        message: "Command is required.",
      });
    }

    const result =
  await businessCopilot(command);
    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    console.error("Command Error:", error);

    return res.status(500).json({
      success: false,
      type: "error",
      message:
        "Something went wrong while processing the command.",
    });

  }
};