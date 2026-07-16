const { execSync } = require("child_process");
try {
  const out = execSync(
    'npx rg --include "*.tsx" -n "<button[\\s>]" app components',
    { encoding: "utf8", cwd: "d:\\scholify\\frontend" }
  );
  const lines = out.split("\n").filter((l) => l.trim());
  const bypasses = lines.filter((l) => !l.includes("<Button"));
  console.log("Total <button matches: " + lines.length);
  console.log("Actual raw <button> bypasses: " + bypasses.length);
  console.log("---");
  bypasses.forEach((l) => console.log(l));
} catch (e) {
  console.log("Error:", e.message);
}
