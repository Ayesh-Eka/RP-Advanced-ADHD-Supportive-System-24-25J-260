const { spawn } = require("child_process");

const predictPriority = (req, res) => {
    const { category, days_to_deadline, interest_level, duration, age, gender } = req.body;

    const pythonProcess = spawn("python", ["TaskPrioritizeModel/model_api_task.py", category, days_to_deadline, interest_level, duration, age, gender]);

    let responseSent = false;

    pythonProcess.stdout.on("data", (data) => {
        if (!responseSent) {
            res.json({ priority: data.toString().trim() });
            responseSent = true;
        }
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
        if (!responseSent) {
            res.status(500).json({ error: "Internal Server Error" });
            responseSent = true;
        }
    });

    pythonProcess.on("close", (code) => {
        if (!responseSent) {
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    });
};

module.exports = {
    predictPriority
};
