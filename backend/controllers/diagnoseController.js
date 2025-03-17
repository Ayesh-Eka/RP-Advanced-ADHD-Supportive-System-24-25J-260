const { spawn } = require("child_process");

exports.predictDisease = (req, res) => {
    const {
        age,
        family_history,
        birth_trauma,
        premature,
        behavior_age,
        life_events,
        focus_difficulty,
        careless_mistakes,
        easily_distracted,
        interrupts_others,
        overactive,
        plays_quietly,
        forgets_activities,
        attention_to_details,
        following_instructions,
        playing_quietly,
        fidgets_hands_feet,
        runs_climbs_excessively,
        talks_excessively,
        loses_items,
        avoids_sustained_mental_effort
    } = req.body;

    const pythonProcess = spawn("python", [
        "disease_detection_Model/model_diagnose.py",
        age, family_history, birth_trauma, premature, behavior_age,
        life_events, focus_difficulty, careless_mistakes, easily_distracted,
        interrupts_others, overactive, plays_quietly, forgets_activities,
        attention_to_details, following_instructions, playing_quietly,
        fidgets_hands_feet, runs_climbs_excessively, talks_excessively,
        loses_items, avoids_sustained_mental_effort
    ]);

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        res.json({ prediction: result.trim() });
    });
};