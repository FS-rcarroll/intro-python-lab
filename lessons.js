window.PYTHON_LESSONS = [
  {
    id: "hello",
    title: "Hello",
    code: `# Lesson 1 — Hello
# print() shows text in the Console below.

print("Hello, RoboticsClub!")
print("Python is running in your browser.")
`,
  },
  {
    id: "variables",
    title: "Variables",
    code: `# Lesson 2 — Variables
# A variable stores a value you can reuse.

name = "Ada"
robots = 3
speed = 1.5

print("Pilot:", name)
print("Robots ready:", robots)
print("Top speed:", speed, "m/s")

# Change a value
robots = robots + 1
print("Now we have", robots, "robots")
`,
  },
  {
    id: "if-else",
    title: "If / Else",
    code: `# Lesson 3 — If / Else
# Choose what happens based on a condition.

battery = 42

print("Battery:", battery, "%")

if battery >= 80:
    print("Status: Ready for a long run")
elif battery >= 30:
    print("Status: OK — keep an eye on charge")
else:
    print("Status: Low — plug in soon")
`,
  },
  {
    id: "loops",
    title: "Loops",
    code: `# Lesson 4 — Loops
# Repeat work with for and while.

print("--- Countdown ---")
for n in range(5, 0, -1):
    print(n)
print("Go!")

print()
print("--- Sensor readings ---")
readings = [12, 18, 9, 22]
total = 0
for value in readings:
    print("reading:", value)
    total = total + value

print("average:", total / len(readings))
`,
  },
  {
    id: "functions",
    title: "Functions",
    code: `# Lesson 5 — Functions
# A function packages steps you can call again.

def greet(name):
    return "Welcome, " + name + "!"

def area(width, height):
    return width * height

print(greet("team"))
print("Pad size:", area(4, 3), "sq units")

# Lists and dicts
parts = ["wheel", "motor", "sensor"]
robot = {"name": "Spark", "wheels": 4}

print("Parts:", parts)
print(robot["name"], "has", robot["wheels"], "wheels")
`,
  },
];
