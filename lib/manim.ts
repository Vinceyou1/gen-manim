import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import { nanoid } from "nanoid";

const execAsync = promisify(exec);

export async function renderManimVideo(
  code: string,
  filename: string = "scene.py",
  sceneName: string = "ManimScene_" + nanoid()
) {
  console.log("sceneName:", sceneName);
  const tempDir = path.join(process.cwd(), "public", "temp");
  await fs.mkdir(tempDir, { recursive: true });

  const filePath = path.join(tempDir, filename);
  await fs.writeFile(filePath, code);

  // Command to run manim
  // -ql: Quality Low (faster rendering for testing)
  // -o: Output filename
  // --media_dir: Directory to store media
  const outputDir = path.join(process.cwd(), "public", "videos");
  const pythonPath =
    "/opt/homebrew/Cellar/manim/0.19.0_1/libexec/lib/python3.14/site-packages";
  const venvPython = path.join(process.cwd(), "venv/bin/python3");
  // Add /Library/TeX/texbin to PATH to ensure latex is found
  const command = `export PATH="/Library/TeX/texbin:$PATH" && PYTHONPATH=${pythonPath} ${venvPython} -m manim -ql -o ${sceneName}.mp4 --media_dir ${outputDir} ${filePath} ${sceneName}`;

  try {
    const { stderr } = await execAsync(command);

    if (stderr) console.error("Manim stderr:", stderr);

    // The output file should be in public/videos/videos/scene/480p15/GenScene.mp4
    // We need to find where exactly manim puts it and move it or return the correct path.
    // By default manim structure is media_dir/videos/module_name/quality/scene_name.mp4

    // Let's try to simplify by moving it to a predictable location
    // Or just return the expected path

    // Constructing the expected path based on default manim behavior with -ql
    // public/videos/videos/scene/480p15/GenScene.mp4
    // Note: 'scene' is the module name (filename without extension)
    const moduleName = path.basename(filename, ".py");
    const videoPath = `/videos/videos/${moduleName}/480p15/${sceneName}.mp4`;

    return videoPath;
  } catch (error) {
    console.error("Error rendering video:", error);
    throw error;
  }
}
